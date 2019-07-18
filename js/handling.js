/*jshint esversion: 6 */

(function( $ ) {
    $.widget( "handling.setbudget",{
      options: {
        statusbar:null,
        planningDone:false
      },

    _create: function() {
        this.options.statusbar = this.element.find('.statusbar')
        this.options.statusbar.textOutput({showWaiting: true});
        this.element.find('#btn-gentrans').click(()=>{
          this.options.statusbar.textOutput('clear');
          if (!this.options.planningDone) {
            this.options.statusbar.textOutput('print','создение транзакций');
            this.transactionPlanning().then((inp)=>{
              this.getReport();
            })
          }else{
            this.getReport();
          }
        });
        this.setDate();
        var formtabs = this.element.find('.formtabs');
        // this.element.find('.daterange').daterange({
        //       usePeriods:true,
        //       dictPeriods: serviceData.reports.currentPeriods
        // });
      },
      transactionPlanning: function () {
        let prom = new Promise((resolve)=>{
          var call = [
            (input)=>{
              if (input[0].content.status == "DONE") {
                  this.options.planningDone=true;
              }
            },
            resolve,
          ];
          var out = [
            {
              'target':{
                  'location':'custom',
                  'module':'billing',
                  'class': "Budget",
              },
              'param':{
                _line:'set',
                 mode:'planning'
              }
            }
          ];
          mxhRequest(out,call);
        });
        return prom;
      },
      getReport:function () {
        var statusbar = this.options.statusbar;
        var thisEl = this.element;
        statusbar.textOutput('print','построение графика',"<br>");
        var call = [function(input) {
          var con = input[0].content;
          google.charts.load('current', {'packages':['line']});
          google.charts.setOnLoadCallback(drawChart);
          function drawChart() {
            var data = new google.visualization.DataTable();
            con.columns.forEach((el,i)=>{
                var tp = i==0 ? 'string' : 'number';
                data.addColumn(tp, el);
            })
            data.addRows(con.rows);
          var options = {
            chart: {
              title: 'planning',
              subtitle: 'allCountsForPeriod' , //out.reports.scriptName
            },
            width: 900,
            height: 500,
            axes: {
              x: {
                0: {side: 'top'}
              }
            }
          };
          var targetEl = $('<div>');
          var reportTab = thisEl.find('#report');
          reportTab.empty();
          reportTab.append(targetEl);
          var chart = new google.charts.Line(targetEl[0]);
          thisEl.find('.formtabs').wintabs('option','active',1);
          chart.draw(data, google.charts.Line.convertOptions(options));
          statusbar.textOutput('print','готово',"<br>");
          statusbar.textOutput('stop');
          thisEl.closest('.windialog').windialog('recountPosition');
          }
        }];
        var out = [
                    {
                      'target':{
                          'module':'content',
                          'class': "ReportGen",
                      },
                      'param':{
                        _line:'getReport',
                        scriptName:'allCountsForPeriod',
                        dateRange : [thisEl.find('#startdate').val(),thisEl.find('#enddate').val()],
                        period : Number(getValElement(thisEl.find('[name="rpid"]'))),
                      }
                    }
                  ];
        mxhRequest(out,call);
      },

      setDate:function() {
        var date = new Date();
        this.element.find('#startdate').val(date.toISOString().substr(0, 10));
        date.setFullYear(date.getFullYear() +1);
        this.element.find('#enddate').val(date.toISOString().substr(0, 10));
      },

      _setOption: function( key, value ) {
        $.Widget.prototype._setOption.apply( this, arguments );
        this._super( "_setOption", key, value );
      },

      destroy: function() {
        $.Widget.prototype.destroy.call( this );
      }
    });
  }( jQuery ) );


(function( $ ) {
  $.widget( "loadScripts.fromCsvMyData",{
    options: {
    },
    _create: function() {
      var elm = $(
                  '<label class="file_load_box">'+
                    '<input id ="btn_load" name = "load_svc" type="file"/>'+
                    '<i><svg style="width: 17px; height: 17px;"><use xlink:href="/file/ico/sprite.svg#folder-open"></use></svg><p>Custom Upload</p></i>'+
                  '</label>'+
                  '<button id = "btn_send">send</button>'+
                  '<div class = "delimiter"></div>'+
                  '<div id = "translist" ></div>');
      this.element.append(elm);
      this.element.prepend(setSelectionbox('accounts',false));

      var floadEl = this.element.find('#btn_load');
      this.element.find('#btn_send').click(()=>{

        this.makeTransactions();
      });
      floadEl.change(()=>{
        this.loadCsv();
      });
    },

    makeTransactions:function() {
      // console.log('makeTransactions');
      var aid = getValElement(this.element.find('[name="aid"]'));
      if (aid) {
              var mainAccount = Number(aid);
              var uid = Number(serviceData.currentUser.uid);
              var rowList= this.element.find('#translist .row');
              function statusСheck(input) {
                var saveData = {
                  id : null,
                  status: null
                };
                try {
                  for (var i = 0; i < input.length; i++) {
                    if (input[i].target=="data-savrecord") {
                      for (var a = 0; a < input[i].content.length; a++) {
                        if (input[i].content[a].status == "DONE") {
                          saveData.id = input[i].content[a].id;
                          saveData.status = "DONE";
                        }
                      }
                    }
                  }

                } catch (e) {}
                return saveData;
              }
              rowList.each((i,el)=>{
                var currEl = $(el);
                var source = currEl.find('[name="source"]').attr('value');
                var dest = currEl.find('[name="dest"]').attr('value');
                  var call = [
                    function(input) {
                      var check = statusСheck(input);
                      if (check.status=='DONE') {
                        currEl.addClass('saved');
                          var tidEl = currEl.find('[name=tid]');
                          tidEl.attr({
                          class: 'dialog link ripple',
                          'data-typedialog' : 'form',
                          'data-href':'/transactions_form/?tid='+check.id+''
                        }).text(check.id);
                        currEl.prepend(tidEl);
                        currEl.ini();
                      }

                    }
                  ];
                  var out = [
                    {
                      'target':{
                          'module':'content',
                          'class': "Form",
                      },
                      'param':{
                        path: "/transactions_form/",
                        main: [
                          {
                            tid:0,
                            tdate: currEl.find('[name="tdate"]').attr('value'), /**/
                            tcurr :'UAN',  /*currency*/
                            accept: 1,
                            plus :currEl.find('[name="plus"]').attr('value'),
                            minus: currEl.find('[name="minus"]').attr('value'),
                            source: currEl.find('[name="source"]').attr('value'),
                            dest: currEl.find('[name="dest"]').attr('value'),
                            scassa : (source == mainAccount)? uid : 0,
                            dcassa : (dest == mainAccount)? uid : 0,
                            descr: 'made script',
                            // oid: SMALLINT UNSIGNED, /*order*/
                            uid: uid,
                            // tfid: SMALLINT UNSIGNED NOT NULL,
                            _line: 'write'
                          }
                        ],
                        mode: "write"
                      }
                    }
                  ];
                  Request.set(out,call,'wait');
                  // mxhRequest(out,call);
              });
              Request.sendAll();
        }else{
          alert('no account selected');
        }
    },

    loadCsv:function() {
      var aid = getValElement(this.element.find('[name="aid"]'));
      if (aid) {
          var floadEl = this.element.find('#btn_load');
          var reader = new FileReader();
          var mainAccount = Number(aid);
          var mainName = 'Кошелек';
          var thisEl = this.element;
          reader.onload = function() {
              thisEl.find('.file_load_box p').text(floadEl[0].files[0].name);
              var textList = reader.result.split("\n");
              var transListEl = thisEl.find('#translist');
              delete textList[0];
              textList.forEach((el,i)=>{
                var row = el.split(',');
                var rowEl = $('<div class = "row">');
                if (row.length==6) {
                  rowEl.append($('<div>').attr({name:'tid',value: 0, style :"width:30px"}));
                  rowEl.append($('<div>').attr({name:'tdate',value: row[1]}).text(row[1]));
                  var accParam = row[3].split('/');
                  if (accParam[0]=='-') {
                    rowEl.append($('<div>').attr({name:'source',value: mainAccount}).text(mainAccount+'-'+mainName));
                    rowEl.append($('<div>').attr({name:'dest',value: accParam[1]}).text(accParam[1]+'-'+accParam[2]));
                    rowEl.append($('<div>').attr({name:'minus',value: row[4]}).text(row[4]));
                    if (accParam[3]=='0') {
                      rowEl.append($('<div>').attr({name:'plus',value: 0}).text(0));
                    }else{
                      rowEl.append($('<div>').attr({name:'plus',value: row[4]}).text(row[4]));
                    }
                  }else if (accParam[0]=='+') {
                    rowEl.append($('<div>').attr({name:'source',value: accParam[1]}).text(accParam[1]+'-'+accParam[2]));
                    rowEl.append($('<div>').attr({name:'dest',value: mainAccount}).text(mainAccount+'-'+mainName));
                    if (accParam[3]=='0') {
                      rowEl.append($('<div>').attr({name:'minus',value: 0}).text(0));
                    }else{
                      rowEl.append($('<div>').attr({name:'minus',value: row[4]}).text(row[4]));
                    }
                    rowEl.append($('<div>').attr({name:'plus',value: row[4]}).text(row[4]));
                  }
                  transListEl.append(rowEl);
                }
              });
              transListEl.journal({
                useControlPanel:false,
              });
          }
          reader.readAsText(floadEl[0].files[0]);
        }else{
          alert('no account selected');
        }
    },

    _setOption: function( key, value ) {
      $.Widget.prototype._setOption.apply( this, arguments );
      this._super( "_setOption", key, value );
    },

    destroy: function() {
      $.Widget.prototype.destroy.call( this );
    }
  });
}( jQuery ) );
