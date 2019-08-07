import agog


# tasks
def payoff():
    '''создает транзакции согласно правилам бюджета'''
    globalVar = agog.db.GlobVar()
    globalVar.set('session',{'uid':'0',
                            'login':'root'
                            })
    billing = agog.tools.importModule('billing')
    result = billing.Budget().set('realchange')

    print('payoff', result )

    # python3 /var/www/buh/py/agog payoff buh /var/www/buh


##
