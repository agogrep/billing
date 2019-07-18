/*jshint esversion: 6 */


(function( $ ) {
    $.widget( "report.allCounts", {
      options: {
        relationshipElement: $(''),
        saveBoxEL: null,
        messageElement: null,
        _stampupdate:0
      },
      _create: function() {
        this.options.relationshipElement = this.element.siblings('.reportparam');
        var reportName = this.element.find('.reportname').text();
        var controlEl = $('<div id = "reportcontrol">'+
          '<label class = "reportset-label lang" >report_set</label>'+
          '<div class = "delimiter"></div>'+
          '<div class = "daterange autolabel" name = "range" value = ""></div>'+
          '<textarea name = "links" class = "autolabel"></textarea>'+
          '<select name="route" class = "combobox  autolabel" value="">'+
            '<option class = "lang" value="balance">balance</option>'+
            '<option class = "lang" value="input">income</option>'+
            '<option class = "lang" value="output">outgo</option>'+
           '</select>'+
        '</div>');
        this.element.append(controlEl);
        var dateRangeEl = controlEl.find('.daterange');
        dateRangeEl.daterange({
          usePeriods:true,
          dictPeriods: serviceData.reports.currentPeriods
        });
        this.loadParam();
        var listEl  = controlEl.find('textarea, select, input');
        listEl.change((el)=>{
          this.whenChanges($(el.target));
        });
        this.element.ini();
        if (this.options.saveBoxEL) {
          this.options.saveBoxEL.preset('option','whenChanges',(currentPeset)=>{
            this.options.relationshipElement.val(currentPeset.data);
            this.loadParam();
          });
        }


        var thisEl = this.element;
        this.options._trigger = (ev)=>{
          // console.log('_trigger ev',ev);
          thisEl.allCounts('send');
        }
        sysTrigger.add('transactions_form.saved',this.options._trigger);
      },
      loadParam:function() {
        var dateRangeEl = this.element.find('.daterange');
        var report = this.options.relationshipElement.val();
        if (report) {
            report = strToObject(report);
            this.element.find('[name = links]').val(report.links);
            this.element.find('[name = route]').val(report.route);
            dateRangeEl.attr('value',JSON.stringify(report.dateRange));
            var chooseEL =   dateRangeEl.find('#choose');
            chooseEL.val(report.period).trigger("chosen:updated");
            dateRangeEl.daterange('valToElement');
            chooseEL.change();
        }
      },
      whenChanges: function (el) {
        var links = this.element.find('[name = links]').val();
        links = links.replace(/\r?\n/g, "");
        var dateRange = this.element.find('.daterange').attr('value');
        if (!$.trim(dateRange)) {dateRange='[]';}
        var report = {
          dateRange: JSON.parse(dateRange),
          links : links,
          route : this.element.find('[name = route]').val(),
          scriptName : this.element.find('[name = sysname]').text(),
          period: this.element.find('.daterange #choose').val(),
        };
        var data = objectToStr(report);
        this.options.relationshipElement.val(data);
        this.options.saveBoxEL.preset('option','data',data);
      },

      send:function(event) {
        // console.log('event',event);
        if (event=='whenSend') {
          this.options._stampupdate = 0;
        }

        var param = this.options.relationshipElement.val();
        param = strToObject(param);
        var out ={
          path :'/s/',
          reports: param
        };
        out.reports._line ='getReport';
        out.reports._stampupdate = this.options._stampupdate;
        out.reports.scriptName = 'allCounts';
        if (out.reports.period) {
          if (out.reports.period!='custom') {
            if (serviceData.reports.currentPeriods[out.reports.period]) {
              var period = serviceData.reports.currentPeriods[out.reports.period];
              out.reports.dateRange[0] =  period.startdate;
              out.reports.dateRange[1] =  period.enddate;
            }else{
              alert('Period is wrong. You need set new paramers in preset');
              return null;
            }
          }
        }


        if (!out.reports.dateRange.length) {
          var ndate = new Date();
          out.reports.dateRange[0] = ndate.toISOString().substr(0, 10);
        }

        var call = [
            (input)=>{
            if(this.options._stampupdate != input[0]._stampupdate){
              this.options._stampupdate = input[0]._stampupdate;
              let html =  serviceData.patterns.reports[out.reports.scriptName];
              let root = this.options.messageElement.html(html);
              let sectionList = root.find('.section');
              sectionList.each((i,sectionEl)=> {
                let sEl = $(sectionEl);
                let row = sEl.find('.row').eq(0);
                let dataList = input[0].content[sEl.attr('name')];

                  dataList.forEach((data)=>{
                    let newEl = row.clone();
                    let nli  =  newEl.find('[name]');
                    nli.each((i,element)=>{
                      let el  = $(element);
                      let name = el.attr('name');
                      el.text(data[name]);
                      if (! el.text().trim()) {
                        el.remove();
                      }
                    });
                    var elList = newEl.children();
                    sEl.append(newEl);
                  });
                  row.remove();
              });
	      root.translate();
              root.find('div[name="table"]').journal({
                useCorrectColumns:true,
              });
	      
            }

          },
        ];
        // трансформация в новый протокол
        var newOut = [
          {
            'target':{
                'module':'content',
                'class': "ReportGen",
            },
            'param':out.reports
          }
        ];
        mxhRequest(newOut,call);
      },

      _setOption: function( key, value ) {
        $.Widget.prototype._setOption.apply( this, arguments );
        this._super( "_setOption", key, value );
      },

      destroy: function() {
        sysTrigger.del('transactions_form.saved',this.options._trigger);
        $.Widget.prototype.destroy.call( this );
      }
    });
  }( jQuery ) );
