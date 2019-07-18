# import agog.sqlgen
from agog import sqlgen








def journal_accounts(**arg):
    # pattern = '''
    # SELECT main.aid,main.aname,main.curr,main.side,main.usebal,main.apdate,main.apbal,main.descr, sub.balance
    # FROM ({sqlInsert}) main INNER JOIN
    #       (
    #         SELECT acc.aid, acc.apdate, acc.apbal,fin.newbal,
    #                 if (fin.newbal is NULL,0+acc.apbal,fin.newbal+acc.apbal) balance FROM accounts acc
    #               LEFT OUTER JOIN
    #               (SELECT pre.aid, pre.apdate, SUM(pre.newbal) newbal FROM
    #                   (SELECT ts.tid, ac.apdate apdate, ts.source aid,(-1*ts.minus) newbal FROM transactions ts
    #                         INNER JOIN accounts ac ON ac.aid = ts.source
    #                                 WHERE ac.apdate < ts.tdate AND ts.accept = 1
    #                   UNION
    #                   SELECT td.tid, ac.apdate apdate, td.dest aid , td.plus newbal FROM transactions td
    #                         INNER JOIN accounts ac ON ac.aid = td.source
    #                                 WHERE ac.apdate < td.tdate AND td.accept = 1) pre
    #               GROUP BY aid) fin ON acc.aid = fin.aid
    #       ) sub ON sub.aid = main.aid
    # '''
    pattern = '''
            SELECT main.aid,main.aname,main.curr,main.side,main.usebal,main.apdate,main.apbal,main.descr, sub.balance, main.is_deleted  FROM ({sqlInsert}) main INNER JOIN
            (
            SELECT acc.aid, acc.apbal,fin.newbal,
               if (fin.newbal is NULL,0+acc.apbal,fin.newbal+acc.apbal) balance FROM accounts acc
             LEFT OUTER JOIN
             (SELECT pre.aid,  SUM(pre.newbal) newbal FROM
                 (SELECT ts.tid,  ts.source aid,(-1*ts.minus) newbal FROM transactions ts
                       INNER JOIN accounts ac ON ac.aid = ts.source
                               WHERE ts.tdate > IFNULL((SELECT apdate FROM actpoints order by apdate desc LIMIT 1),0) AND ts.accept = 1
                 UNION
                 SELECT td.tid, td.dest aid , td.plus newbal FROM transactions td
                       INNER JOIN accounts ac ON ac.aid = td.dest
                               WHERE td.tdate > IFNULL((SELECT apdate FROM actpoints order by apdate desc LIMIT 1),0) AND td.accept = 1) pre
             GROUP BY aid) fin ON acc.aid = fin.aid
            ) sub ON sub.aid = main.aid;
'''
    sqlInsert = sqlgen.journal(**arg)
    return pattern.format(sqlInsert = sqlInsert)


def report_accounts(**param):
    '''
    JSON:
    param  = {    # filter
        links : '',
        'route': 'balance' / 'input' / 'output'
        dateRange: [<date>,<date>]
    }

    '''
    mainTable = 'accounts'
    filtersAccount = param.get('links')
    if filtersAccount:
        table = sqlgen.filterByLinkedTables(mainTable,param['links'])
        table = table[table.find('(')+1:table.rfind(')')]
    else:
        table = 'SELECT * FROM accounts'

    route = param.get('route')
    dateRange = param.get('dateRange')
    defDate = 'AND tdate > IFNULL((SELECT apdate FROM actpoints order by apdate desc LIMIT 1),0)'
    rdate = ''
    useapbal = '+acc.apbal'
    if dateRange:
        if len(dateRange)==1:
            rdate = '{0} AND tdate <= "{1}"'.format(defDate,dateRange[0]+' 23:59')
        if len(dateRange)==2:
            rdate = ' AND tdate >= "{0}" AND tdate <= "{1}"'.format(dateRange[0],dateRange[1]+' 23:59')
            useapbal = ''
        if len(dateRange)==0:
            rdate = dateRange
    else:
        rdate = defDate
    arg = {
        'useapbal' :useapbal,
        'rangeDate' : rdate,
        'favorAccounts' : table
    }
    # print(table)
    # print(filterByLinkedTables(mainTable,filters))



    sqlInput = '''
    SELECT * FROM accounts main INNER JOIN
        (SELECT pre.aid, SUM(pre.input) input FROM
          (SELECT t.tid, t.source aid , t.plus input FROM transactions t
              INNER JOIN ({favorAccounts}) ac ON ac.aid = t.source
                      WHERE  accept = 1  {rangeDate}) pre
         GROUP BY aid) sub ON sub.aid = main.aid
         '''

    sqlOutput = '''
    SELECT * FROM accounts main INNER JOIN
        (SELECT pre.aid,SUM(pre.output) output FROM
          (SELECT t.tid, t.dest aid , t.minus output FROM transactions t
              INNER JOIN ({favorAccounts}) ac ON ac.aid = t.dest
                      WHERE  t.accept = 1 {rangeDate}) pre
         GROUP BY aid) sub ON sub.aid = main.aid
     '''

    sqlBalance  = '''SELECT main.aid,main.aname,main.curr,sub.balance FROM ({favorAccounts}) main INNER JOIN
          (
          SELECT acc.aid, acc.apbal,fin.newbal,
             if (fin.newbal is NULL,0 {useapbal},fin.newbal {useapbal}) balance FROM ({favorAccounts}) acc
           LEFT OUTER JOIN
           (SELECT pre.aid,  SUM(pre.newbal) newbal FROM
               (SELECT ts.tid,  ts.source aid,(-1*ts.minus) newbal FROM transactions ts
                     INNER JOIN ({favorAccounts}) ac ON ac.aid = ts.source
                             WHERE accept = 1 {rangeDate}
               UNION
               SELECT td.tid, td.dest aid , td.plus newbal FROM transactions td
                     INNER JOIN ({favorAccounts}) ac ON ac.aid = td.dest
                             WHERE accept = 1 {rangeDate} ) pre
           GROUP BY aid) fin ON acc.aid = fin.aid
          ) sub ON sub.aid = main.aid'''.format(**arg)

    if route == 'input':
        sql = sqlInput.format(**arg)
    elif route == 'output':
        sql  = sqlOutput.format(**arg)
    else:
        sql  = sqlBalance.format(**arg)





    return sql
