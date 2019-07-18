
import json
import logging, traceback
from datetime import datetime

from agog import serverman, db, content, tools, traceLevel
currentBase = db.GlobVar().get('currentBase')
log = logging.getLogger(currentBase+'.requests')

# def strToObject(str): # рудимент
#   out = str.replace('&&(','{').replace('&&)','}')
#   try:
#       return json.loads(out)
#   except Exception as e:
#       return None

class Budget:
    mode = 'planning' # 'realchange'
    base = None
    def __init__(self):
        self.base = db.dbSql()

    def manager(self,param):
        self._line = param.pop('_line')
        return [
            { 'target': self._line, 'content': getattr(self, self._line)(**param)}]

    def set(self,mode):
        try:
            ev = serverman.Event()
            ev.deleteAllUnrelated()
            self.mode = mode;
            self.scheduledExecution();
            return {'status':'DONE'}
        except Exception as e:
            reqLog = tools.customLogger('requests')
            reqLog.error( traceback.format_exc( traceLevel ) )
            return {'status':'ERROR'}


    def setTransaction(self,budgetrule):
        amount = 0
        if budgetrule['sum']:
            amount = budgetrule['sum']
        elif budgetrule['rparam'].strip():
            reportParam = json.loads(budgetrule['rparam'])
            dateRange = reportParam.get('dateRange')
            if dateRange is None:
                deltaDate = '''
                (SELECT * FROM events WHERE relclass = 'reportperiods' AND relid = {1}
                              AND edate < "{0}" ORDER BY edate DESC LIMIT 1)
                UNION
                (SELECT * FROM events WHERE relclass = 'reportperiods' AND relid = {1}
                              AND edate >= "{0}"
                              ORDER BY edate LIMIT 1)'''.format( budgetrule['edate'],budgetrule['rpid'] )

                self.base.cursor.execute(deltaDate)
                rows = self.base.cursor.fetchall()
                dateRange = []

                l = len(rows)

                if l == 2:
                    # print('>>>>>>>>>> ','dateRange', rows)
                    dateRange = [rows[0]['edate'],rows[1]['edate']]
                elif l ==1:
                    if (rows[0]['edate'] < budgetrule['edate']):
                        dateRange.append(rows[0]['edate'])
                        dateRange.append(budgetrule['edate'])
                    else:
                        dateRange.append(rows[0]['edate'])
                else:
                    dateRange.append(budgetrule['edate'])

            # print('budgetrule',budgetrule['brid'])


            reportParam['dateRange']= dateRange

            if self.mode =='planning':
                reportParam['mode'] = self.mode

            report = content.ReportGen()
            res = report.getReport(reportParam)



            try:
                RESULT = float(res['amount'][0]['amount'])
                amount = eval(budgetrule['script'])

            except Exception as e:
                print(e)
                return


        values = {
            'table' :  'temp_transactions' if self.mode == 'planning' else 'transactions',
            'tdate':    budgetrule['edate'],
            'tcurr': 'UAN',
            'accept':   1,
            'minus':    amount if budgetrule['sourceusebal']==1 else 0,
            'plus':     amount if budgetrule['destusebal']==1 else 0,
            'source':   budgetrule['source'],
            'dest':     budgetrule['dest'],
            'scassa':   0,
            'dcassa':   0,
            'descr':    'brid {0}'.format(budgetrule['brid']),
            'uid':      1

        }


        sql = '''
            INSERT INTO {table} (tdate,tcurr,accept,minus,plus,source,dest,scassa,dcassa,descr,uid)
            VALUES ("{tdate}","{tcurr}",{accept},{minus},{plus},
                      {source},{dest},{scassa},{dcassa},"{descr}",{uid})
        '''.format(**values)
        self.base.cursor.execute(sql)



    def preparation(self):
        '''preparation of temporary tables for calculating the budget'''
        sqlList = [
            'DELETE FROM temp_accounts',
            'DELETE FROM temp_transactions',
            'DELETE FROM temp_actpoints',
            'INSERT INTO temp_accounts SELECT aid,aname,curr,side,usebal,apdate,apbal,descr,is_deleted FROM accounts',
            'INSERT INTO temp_actpoints SELECT apid, aname, apdate, descr,is_deleted FROM actpoints'
        ]
        for sql in sqlList:
            # print(sql)
            self.base.cursor.execute(sql)


        # make the update point in temp_table
        ap = BillingManagement()
        ap.setAP(datetime.now(),'preparation')


    def scheduledExecution(self):
        # prefix = ''
        print('scheduledExecution =======================')
        '''by default, transactions are created only
        for rules that have the type autodefer'''
        levelType = 2 # is "autodefer". else 0 - for all types

        forToday = ''
        if self.mode == 'planning':
            self.preparation()
            levelType = 0
            # prefix = 'temp_'
        else:
            forToday = 'AND edate <= "{0}"'.format(str(datetime.now().date()))

        # select events for the reporting period
        sql  = '''
            SELECT ev.eid, ev.edate, b.brid,b.script,b.rparam,b.source,b.dest,b.sum,b.type,
                b.rpid,b.sourceusebal,b.destusebal
            FROM (SELECT * FROM events
                        WHERE relclass = 'budgetrules' AND done = 0 {forToday}
                        ORDER BY  edate, priority) ev
                 INNER JOIN ( SELECT brid, script,rparam,source,
                                    dest,sum,type,rpid,
                                    s.usebal sourceusebal, d.usebal destusebal
                                    FROM budgetrules
                              INNER JOIN accounts s ON s.aid = source
                              INNER JOIN accounts d ON d.aid = dest
                              WHERE type >= {type}
                             ) b ON ev.relid = b.brid
        '''.format(forToday = forToday,type = levelType)

        self.base.cursor.execute(sql)
        rows = self.base.cursor.fetchall()


        eventsList = []
        for row in rows:
            self.setTransaction(row)
            eventsList.append(str(row['eid']))

        self.base.conn.commit()


        if self.mode !='planning':
            if len(eventsList):
                self.setDone(eventsList)

    def setDone(self,eventsList):
        '''set the mark about the done event'''
        evLisStr = ', '.join(eventsList)


        sql = '''
        UPDATE events SET done = 1
                    WHERE eid in ({0})
        '''.format(evLisStr)
        self.base.cursor.execute(sql)
        self.base.conn.commit()


class BillingManagement:

    def __init__(self):
        pass

    def manager(self,param):
        # log.debug(param)
        self._line = param.pop('_line')
        return [{ 'target': self._line, 'content': getattr(self, self._line)(**param)}]

    def setAP(self,date,mode='realchange'):
        # print('setAP(self,date,mode')
        ''' dt -  datetime; mode = 'planning' (для операций планирования) / 'preparation (подготовка к операйиям планирования)
        '''
        dt = date
        prefix = ''
        if mode == 'planning':
            prefix = 'temp_'

        sql = '''
            SELECT acc.aid,
               if (fin.newbal is NULL,0+acc.apbal,fin.newbal+acc.apbal) balance FROM {prefix}accounts acc
             LEFT OUTER JOIN
             (SELECT pre.aid,  SUM(pre.newbal) newbal FROM
                 (SELECT ts.tid,  ts.source aid,(-1*ts.minus) newbal FROM {prefix}transactions ts
                       INNER JOIN {prefix}accounts ac ON ac.aid = ts.source
                               WHERE ts.tdate > (SELECT apdate FROM {prefix}actpoints order by apdate desc LIMIT 1)
                               AND ts.tdate <= "{datetime}" AND ts.accept = 1
                 UNION
                 SELECT td.tid, td.dest aid , td.plus newbal FROM {prefix}transactions td
                       INNER JOIN {prefix}accounts ac ON ac.aid = td.source
                               WHERE td.tdate > (SELECT apdate FROM {prefix}actpoints order by apdate desc LIMIT 1)
                               AND td.tdate <= "{datetime}" AND td.accept = 1) pre
             GROUP BY aid) fin ON acc.aid = fin.aid

        '''
        base = db.dbSql()
        rows = base.request2(sql.format(datetime = dt, prefix=prefix))

        for row in rows:
            sql = '''
            UPDATE {prefix}accounts SET apbal = {balance} WHERE aid = {aid}
            '''
            if mode == 'preparation':
                prefix = 'temp_'
            row['prefix']= prefix
            base.cursor.execute(sql.format(**row))

        if mode == 'realchange':
            sql = '''
                    REPLACE INTO cassapoints (cpid, uid, curr,apbal)
                    SELECT pre.cpid, pre.uid, pre.curr, SUM(pre.newbal) newbal FROM
                    (
                        SELECT cpid, uid, curr, apbal newbal FROM cassapoints
                        UNION
                        SELECT 0 cpid, ts.scassa uid, a.curr, (-1*ts.minus) newbal FROM transactions ts
                            INNER JOIN users us ON us.uid = ts.scassa
                            INNER JOIN accounts a ON a.aid = ts.source
                                               WHERE ts.tdate >
                                               (SELECT apdate FROM actpoints order by apdate desc LIMIT 1)
                                               AND ts.tdate <= "{datetime}" AND ts.accept = 1
                        UNION
                        SELECT 0 cpid, td.dcassa uid , a.curr, td.plus newbal FROM transactions td
                            INNER JOIN users ud ON ud.uid = td.dcassa
                            INNER JOIN accounts a ON a.aid = td.dest
                                               WHERE td.tdate >
                                               (SELECT apdate FROM actpoints order by apdate desc LIMIT 1)
                                                AND td.tdate <= "{datetime}" AND td.accept = 1

                    ) pre
                    GROUP BY pre.uid, pre.curr;
                '''
            base.cursor.execute(sql.format(datetime = dt))

        if mode != 'realchange':
            prefix = 'temp_'

        base.cursor.execute(
            '''INSERT INTO {0}actpoints (apdate) VALUES ("{1}")'''.format(prefix, dt)
        )
        base.conn.commit()
        return 'DONE'
