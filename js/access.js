window.access = (function () {
    var access = {
        thatAvailable: function (param) {
          /*
          {
          .. адрес ..
          type: 'table','report',
          class : 'users','accounts','allCounts'
          form : 'list' , 'form'
          part: 'main',
          unit: 'uid',
          -- user --
          gid: в клиентской части не используется
          uid:
          -- команда --
          line: 'соманда запроса'
          }
          */
          // временный скрипт симулирует работу функции
            switch (param.type) {
              case 'report':
                return ['allCounts(1)']
                break;
              case 'table':
                switch (param.form) {
                  case 'list':
                    return ['users','accounts','budgetrules','labels','reportperiods','transactions'];
                    break;
                  case 'form':
                    return ['users','accounts','budgetrules','labels','reportperiods','transactions'];
                  break;
                }
                break;
            }
        }
    };
    return access;
}());
