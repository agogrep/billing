from agog import db
from mailmerge import MailMerge


def fillContract(fileName,cid):
    sql = "SELECT * FROM users WHERE uid = {0}".format( int( cid ) )
    base = db.dbSql()
    rows = base.request(sql)
    row = rows[0] if len(rows)>0 else {}

    doc = MailMerge(fileName)
    doc.merge(**row)
    doc.write(fileName+'new')
    return fileName+'new'
