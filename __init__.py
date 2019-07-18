from agog import tools


billing = tools.importModule('billing')

def events():
    # одработка текущих событий
    billing.Budget().set('realchange')





currentEvents = events
