/*jshint esversion: 6 */

(function( $ ) {
    $.widget( "handling.setbudget",{
      options: {
        statusbar:null,
        planningDone:false
      },

    _create: function() {

        var thisEl =   this.element;
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
        // var formtabs = this.element.find('.formtabs');


        // управление задачами
        var taskbox = this.element.find('#taskbox');
        var orgEl = this.element.find('#org');

        var date = new Date();
        var toDay = 'edate <= '+date.toISOString().substr(0, 10);
        var param = {
          useStandardButtons:false,
          choicemode : 'multi',
          masterfield : 'eid',
          path :'/events_budget_list/',
          countrows :  10,
          links : 'is_deleted = 0 && done = 0 && events.relid@budgetrules.type > 0 && '+toDay,
          relationshipElement : orgEl
        }
        taskbox.selectItems(param);
        orgEl.addClass('hidden');
        var buttonsboxEl = taskbox.find('#buttonsbox');
        var btn_execute = $('<button id = "btn_execute">execute</button>');
        var btn_clear = $('<button id = "btn_clear">clear</button>');
        var btn_recount = $('<button id = "btn_recount">recount</button>');
        buttonsboxEl.append(btn_recount,btn_execute,btn_clear);

        btn_recount.click(()=>{
          var rowlist = taskbox.find('#org .row:not(.subrow)');
          var valList = [];
          rowlist.each((i,el)=>{
            var eid = Number($(el).find('[name="eid"]').text());
            valList.push(eid);
          });
          // console.log(valList);

          var out = [
            {
              'target':{
                  'location':'custom',
                  'module':'billing',
                  'class': "Budget",
              },
              'param':{
                _line:'ruleReportsList',
                 idList: valList
              }
            }
          ];
          var call = [
            (input)=>{
              // taskbox.find('#org .row:not(.subrow)')
              for (var el in input[0].content) {
                var curEl = taskbox.find('#org .row:not(.subrow) [name=eid]:contains('+String(el)+')');

                var cred = input[0].content[el].credited;
                var pay = input[0].content[el].payment;
                var cal = (pay - cred)<0 ? 0 : pay-cred;
                curEl.siblings('[name=cal_amount]').text( String( cal ));
                curEl.siblings('[name=sum]').text( String( input[0].content[el].payment ));
              }
              // console.log('content',input[0].content);
              taskbox.find('#tab').wintabs('option','active',0);
            }

          ];
          mxhRequest(out,call);
        });


        btn_clear.click(()=>{
          thisEl.setbudget('clearTasks');

        });
        btn_execute.click(()=>{
          var rowlist = taskbox.find('#org .ec-row-selected:not(.subrow)');
          var valList = [];
          rowlist.each((i,el)=>{
            var eid = Number($(el).find('[name="eid"]').text());
            var fixed_amount = Number($(el).find('[name="fixed_amount"] input').val());
            valList.push([ eid, fixed_amount? fixed_amount : 0  ]);
            // console.log(i,el);
          });
          console.log(valList);

          var out = [
            {
              'target':{
                  'location':'custom',
                  'module':'billing',
                  'class': "Budget",
              },
              'param':{
                _line:'set',
                 mode:'realchange',
                 idList: valList
              }
            }
          ];
          var call = [
            (input)=>{
              if (input[0].content.status =="DONE") {
                thisEl.setbudget('clearTasks');
                taskbox.selectItems('option','_allJournal').journal('applyFilter',0);
              }else{
                var errListEl = $('<ul>');
                for (var i = 0; i < input[0].content.log.length; i++) {
                  var li = $('<li>').text(input[0].content.log[i]);
                  errListEl.append(li);
                }
                errListEl.windialog({'typedialog':'error'});
              }
            }
          ];
          mxhRequest(out,call);
        });

        this.element.find('#taskbox').click((ev)=>{
          if ('name' in ev.target.attributes) {
            var fixAmEl = $(ev.target);
            console.log('fixAmEl',fixAmEl.parent()[0].id);
            var isTitles =  (fixAmEl.parent()[0].id == 'titles');

            if ((ev.target.attributes.name.nodeValue == 'fixed_amount') && (!isTitles)) {
                console.log('target',ev.target.attributes.name.nodeValue);
                // if (!fixAmEl.hasClass('is-input')) {
                console.log('============ not is-input');
                var extInput = fixAmEl.find('input');
                if (extInput.length==0) {
                  var innerText = fixAmEl.text();
                  var inputEl = $('<input>');
                  // pattern="([^0].?|0[^0])"  pattern="\d+(\.\d{2})?"
                  inputEl.val(innerText);
                  fixAmEl.text('').append(inputEl);
                  inputEl.focus();
                }else{
                  extInput.focus();
                }
            }
          }
        });




      },
      clearTasks:function(){
        this.element.find('#taskbox #org .row.org').remove();
        // taskbox.find('#org .row.org').remove();
        this.element.find('.formtabs #all .inbuilt-journal .ec-row-selected').checkrow('toggle');

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
          thisEl.find('.formtabs').wintabs('option','active',3);
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
