from agog import db
from mailmerge import MailMerge


def fillContract(fileName,cid):
    base = db.dbSql()
    sql = '''
        SELECT
            c.cdate     "DATA",
            c.cid       "NUM_CONTRACT",
            c.enddate   "END_DATA",
            o.sid       osid,
            o.sname     "CON.NAME",
            o.sfullname "CON.FULL_NAME",
            o.inn       "CON.INN",
            o.stype     "CON.TYPE",
            o.regnum    "CON.REG_NUMBER" ,
            o.regdate   "CON.REG_DATE",
            o.taxation  "CON.TAXATION",
            o.admin     "CON.ADMIN",
            o.contacts  "CON.CONTACTS",
            u.sid       usid,
            u.sname     "CUS.NAME",
            u.sfullname "CUS.FULL_NAME",
            u.inn       "CUS.INN",
            u.stype     "CUS.TYPE",
            u.regnum    "CUS.REG_NUMBER",
            u.regdate   "CUS.REG_DATE",
            u.taxation  "CUS.TAXATION",
            u.admin     "CUS.ADMIN",
            u.contacts  "CUS.CONTACTS",
            b.sum       "SUM"
        FROM contracts c
        LEFT OUTER JOIN subjects o ON c.contractor = o.sid
        LEFT OUTER JOIN subjects u ON c.customer = u.sid
        LEFT OUTER JOIN budgetrules b ON c.budget = b.brid
        WHERE cid = {0};
    '''
    rows = base.request( sql.format( int( cid ) ) )
    vars = rows[0] if len(rows)>0 else {}



    sql2 = '''
    SELECT s.sid, GROUP_CONCAT(a.iban SEPARATOR ', ' ) iban  FROM subjects s
    INNER JOIN accounts a ON a.sid = s.sid WHERE a.iban <> '' AND s.sid = {0}
    GROUP BY s.sid
    '''
    sids = {
    'osid': 'CON.IBAN',
    'usid': 'CUS.IBAN'
    }
    for sidEl in sids:
        if sidEl in vars:
            rows = base.request( sql2.format( vars.get('osid') ) )
            vars[ sids[sidEl] ] = rows[0]['iban'] if len(rows) > 0 else ''

    for el in vars:
        vars[el] =  str(vars[el])

    # print('complete 61', vars)
    doc = MailMerge(fileName)
    doc.merge(**vars)
    doc.write(fileName+'new')
    return fileName+'new'
