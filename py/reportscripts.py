#!/usr/bin/env python3
# -*- coding: utf-8 -*-
__version__ = '1.01'
__compatibility__ = '1.01'

import inspect, os.path
import sys, traceback
import pathlib
import logging

from datetime import datetime
# FILENAME = inspect.getframeinfo(inspect.currentframe()).filename
# ROOTPATH = pathlib.Path(os.path.dirname(os.path.abspath(FILENAME))).parent
# sys.path.append(str(ROOTPATH.joinpath('py')))


from agog import db,sqlgen,tools, serverman


customsqlgen = tools.importModule('customsqlgen')

# import agog.db
# import agog.sqlgen
# import agog.tools


# try:
#     LOG_DEB_CONFIG = { 'format': u'%(levelname)-8s [%(asctime)s] %(message)s',
#                         'level': logging.DEBUG,
#                         'filename': str(ROOTPATH.joinpath('logs','main.log'))
#     }
#     logging.basicConfig(**LOG_DEB_CONFIG)
# except Exception:
#     pass
'''
JSON:
out = {
    <section>:[
        {<name>:<var>}
    ]

}
'''
log = logging.getLogger().debug
mainlog = logging.getLogger('main')

#===================== SYSTEMEVENT ===========================
def loadToServiceDate():
    # list = ['currentPeriods']
    out = {}

    # currentModule = sys.modules[__name__]
    # for el in list:
    #     script = getattr(currentModule, el)
    #     out[el] = script()
    return out




#++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

def allCounts(**param):
        # print('def allCounts(**param):')

        # logging.error('!!!!!!!!!!! allCounts')
        '''
        JSON:
        {
            mode : 'planning' # 'realchange'
            dateRange : ['',''],
            'links':'',
            'route': 'balance' / 'input' / 'output'
        }
        '''
        out = {}
        # routeList = ['balance','input','output']
        # if 'routeList' in param:
        #     routeList = param.pop('routeList')
        if '_stampupdate' in param:
            inStamp = param.pop('_stampupdate')
            currentStamp = serverman.ChangeDetect('transactions_form').has()
            out['_stampupdate'] = currentStamp
            if inStamp == currentStamp:
                return out


        # print('dir(sqlgen)',dir(sqlgen))
        sql = customsqlgen.report_accounts(**param)

        # print('sql',sql)
        if param.get('mode')=='planning':
            sql = sql.replace('transactions','temp_transactions'
                            ).replace('accounts','temp_accounts'
                            ).replace('actpoints','temp_actpoints')

        # logging.debug(sql)

        base  = db.dbSql()
        rows = base.request2(sql)

        # print('rows',rows)
        out['table'] = rows
        out['date'] = param['dateRange'][len(param['dateRange'])-1]

        amount  =  0
        for row in rows:
            amount += row[param['route']]
        out['amount'] = [{'amount':amount}]

        return out


def allCountsForPeriod(**param):
    '''
    JSON
    {
        period: <int> # id reportperiods,
        dateRange: <dateRange>
    }
    '''

    base  = db.dbSql()
    startdate = ''
    enddate = ''
    if len(param['dateRange'])==1:
        aprows = base.request2('SELECT apdate FROM actpoints order by apdate desc LIMIT 1')
        if len(aprows):
            startdate = str(aprows[0]['apdate'])
            enddate = param['dateRange'][0]
    elif len(param['dateRange'])==2:
        startdate = param['dateRange'][0]
        enddate = param['dateRange'][1]


    sql  = '''SELECT edate FROM events WHERE relclass = "reportperiods"
            AND relid = {period} AND edate > "{startdate}" AND edate <= "{enddate}" ORDER BY edate'''
    sql = sql.format(period=param['period'],startdate =startdate,enddate =enddate)

    evrows = base.request2(sql)
    # print(evrows)
    columns = ['date','amount']
    rows = []

    curdate = datetime.now()
    mode = 'realchange'
    for ev in evrows:
        if curdate < ev['edate']:
            mode = 'planning'


        report = allCounts(**{
                    'mode' : mode,
                    'dateRange' : [str(ev['edate'])],
                    'links':'side = 0',
                    'route': 'balance'
        })
        lReport = len(report['table'])
        #  aid,aname,curr,balance
        rowdata = [0 for i in range(lReport+2)]
        rowdata[0] = str(ev['edate'].date())
        rowdata[1] = float(report['amount'][0]['amount'])
        for rep in report['table']:
            name = str(rep['aid'])+'-'+rep['aname']
            if not(name in columns):
                columns.append(name)
            # print(columns)
            num = columns.index(name)
            rowdata[num] = float(rep['balance'])

        rows.append(rowdata)

    out = {
        'columns':columns,
        'rows':rows
    }
    return out




# def currentPeriods(**param):
#     '''
#         {
#             date: <str>,
#             rpid: <int>
#         }
#
#     '''
#     date = param.get('date') if 'date' in param else str(datetime.now().date())
#     rpid = param.get('rpid') if 'rpid' in param else ''
#     if rpid:
#         where = 'WHERE rpid = {0}'.format(rpid)
#     else:
#         where = ''
#     sql = '''
#         SELECT @id := rp.rpid rpid, rp.name,
#         DATE_ADD((SELECT edate FROM events WHERE relclass = "reportperiods" AND edate <= "{date}" AND relid = @id ORDER BY edate DESC  LIMIT 1), INTERVAL 1 DAY) startdate,
#         (SELECT edate FROM events WHERE relclass = "reportperiods" AND edate >= "{date}" AND relid = @id ORDER BY edate LIMIT 1) enddate
#         FROM
#         (SELECT rpid, name FROM reportperiods {where}) rp;
#
#     '''.format(date=date,where=where)
#     base  = db.dbSql()
#     rows = base.request2(sql)
#     out = {}
#     for row in rows:
#         row['startdate'] = str(row['startdate'].date()) if  row['startdate'] else ''
#         row['enddate'] = str(row['enddate'].date()) if  row['enddate'] else ''
#         out[row.pop('rpid')] = row
#     # log(rows)
#
#
#     return out









if __name__ == '__main__':
    tools.Logger()
    globalVar = db.GlobVar()
    globalVar.set('cookie',{'login':'amdin'})
# print(allCountsForPeriod(**{
#     'period': 3,
#     'dateRange': ["2018-06-01","2018-10-31"]
# }))
    # pp = {
    #     'dateRange' : ['2019-02-05'],
    #     'mode': 'realchange',
    #     'links':'accounts.side = 0 && accounts.curr = UAN',
    #     'route':'balance'
    # }
    #
    #
    #
    # print(allCounts(**pp))
    # log(currentPeriods(**{'rpid':4}))
