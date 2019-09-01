/*jshint esversion: 6 */
//########### configuration BILLING #########################################



var contracts_form = {
  whenEndLoad:function () {
    var thisEl = this.element;
    var data = this.element.form('option','relationshipElement').data();
    var inData = {};
    if ('importData' in data) {
      inData = data.importData(this.element);
    }
    for (var el in inData) {
      var currEl = this.element.find('[name='+el+']');
      currEl.text(inData[el]);
      currEl.closest('.row').removeClass('subrow');
      if (currEl.attr('data-href')) {
        currEl.attr('data-href', currEl.attr('data-href')+inData[el]);
      }
    }

    if ('customer' in inData) {
      // console.log('data-relationship',this.element.find('[data-relationship = "#budget"]'));
      this.element.find('[data-relationship = "#budget"]').attr('data-links',
      'is_deleted = 0 && ( budgetrules.source@accounts.sid = '+inData.customer+' || budgetrules.dest@accounts.sid = '+inData.customer+' )')
    }

    var btnFill = this.element.find('#btn_fill');
    btnFill.change(()=>{
      console.log('btnFill.change(()=>{',thisEl.find('[name="cid"]').text());
      var cid = thisEl.find('[name="cid"]').text();
      if (cid) {
        var file = btnFill[0].files[0];
        autoCompleteDocuments(file,'fillContract',{cid:cid});
      }
    });

  }
}

var accounts_form = {
  whenEndLoad:function () {
    var thisEl = this.element;
    var data = thisEl.form('option','relationshipElement').data();
    if ('importData' in data) {
      data.importData(this.element);
    }
  }
}





var subjects_form = {
    whenEndLoad:function () {
      var thisEl = this.element;

      //.addClass('.disabled');
      thisEl.form('option','whenSevedForm',tabsLock);
      function tabsLock() {
        var sid = thisEl.find('[name="sid"]').text();
        if (sid) {
            thisEl.find('[href="#accounts"],[href="#budget"]').closest('li').removeClass('disabled');
        }else{
            thisEl.find('[href="#accounts"],[href="#budget"]').closest('li').addClass('disabled');
        }
      }
      tabsLock();



      var btnNewContract = thisEl.find('#btn-new-contract');
      function contResult(contThisEl) {
        var cid = contThisEl.find('[name=cid]').text();
        if (cid) {
          var currcidEL = thisEl.find('[name=currcid]');
          var dataHref = currcidEL.attr('data-href');
          dataHref = dataHref.split('=')[0];
          currcidEL.attr('data-href',dataHref+'='+cid);
          currcidEL.text(cid);
          var cdate = getValElement(contThisEl.find('[name=cdate]'));
          thisEl.find('[name=cdate]').text(cdate);
        }
      }
      function getData(contThisEl) {
        contThisEl.form('option','whenCloseForm',contResult)
        var out = {
          customer : thisEl.find('[name=sid]').text(),
          uname: getValElement(thisEl.find('[name=sname]')),
        }
        return out;
      }
      btnNewContract.data({ importData: getData });


      function detDataForAcc(accThisEl) {
        var sidEl = accThisEl.find('[name=sid]');
        var sid = thisEl.find('[name=sid]').text();
        sidEl.text(sid).attr('data-href',sidEl.attr('data-href')+sid);
        accThisEl.find('[name=sname]').text( thisEl.find('[name=sname]').val());
        sidEl.closest('.row').removeClass('subrow');
      }

      var showTab = (ev,ui)=>{
        var sid = thisEl.find('[name=sid]').text();
        if (ev.currentTarget.hash == "#accounts") {
          var accJourEl =  thisEl.find('#accounts .journal');
          var links = accJourEl.journal('option','links');

          if (! links) {
            var lnk = 'is_deleted = 0 && sid = '+sid;
            accJourEl.journal('option','links',lnk);
          }

          // \s+sid\s=\s\d+
          // var t = /\s+sid\s=\s\d+/;
          // if (t.test(links)) {
          //   links.replace(t,'sid = '+sid);
          // }else{
          //   if (links) {
          //     accJourEl.journal('option','links',links + ' && '+'sid = '+sid);
          //   }else{
          //     accJourEl.journal('option','links','is_deleted = 0 && '+'sid = '+sid);
          //   }
          // }

          accJourEl.journal('applyFilter',0);
          this.element.find('#accounts #new-element').data({importData:detDataForAcc});


        }else if (ev.currentTarget.hash == "#budget") {

          var bugJourEl = thisEl.find('#budget .journal');
          var links = bugJourEl.journal('option','links');
          console.log('links ===========',links);
          if (! links) {
            var lnk = 'is_deleted = 0 && ( budgetrules.source@accounts.sid = '+sid+' || budgetrules.dest@accounts.sid = '+sid+' )';
            bugJourEl.journal('option','links',lnk);
          }


          // \s+sid\s=\s\d+
          // var t = /budgetrules.\w+@accounts.sid\s=\s\d+/;
          // if (t.test(links)) {
          //
          //   links.replace(t,'sid = '+sid);
          // }else{
          //   if (links) {
          //     bugJourEl.journal('option','links',links + ' && '+'sid = '+sid);
          //   }else{
          //     bugJourEl.journal('option','links','is_deleted = 0 && '+'sid = '+sid);
          //   }
          // }

          bugJourEl.journal('applyFilter',0);
        }
      }
      thisEl.find('.formtabs').wintabs( "option","activate", showTab);

      thisEl.find('#budget .journal').journal('option','sel_fields','brid, name, type, source, dest, is_deleted');
    }

}









var budgetrules_form =  {

  whenEndLoad:function () {
    var thisEl = this.element;
    // console.log('whenEndLoad',this.element.find('#report.selectionvalue'));
    this.element.find('#report.selectionvalue').changeDiv(target=>{
      thisEl.find('.formtabs').wintabs('tabsResize');
      thisEl.windialog('recountPosition');

      });

    this.element.find('.reportbox').report('openSet');

    var source = this.element.find('[name=source]').text();
    var dest = this.element.find('[name=dest]').text();;

    if ((source)&&(dest)) {
      this.element.find('#transactions').journal({
        links:'transactions.is_deleted = 0 && transactions.source = '+source+' && transactions.dest = '+dest+'',
        sel_fields:'tid,tdate,source,minus,dest,plus,descr,is_deleted'
      });


      function getData() {
        var fieldList = ['source','sourcename','sourcecurr','sourceside','sourceusebal','dest','destname','destcurr','destside','destusebal','sum'];
        var data = {};
        for (var i = 0; i < fieldList.length; i++) {
          var val = getValElement( thisEl.find('#basic [name='+fieldList[i]+']') );
          data[fieldList[i]] = val;
        }
        var out = [
          {
            'target':{
                'location':'custom',
                'module':'billing',
                'class': "Budget",
            },
            'param':{
              _line:'ruleReports',
               edate: new Date().toISOString().substr(0, 10),
               brid: getValElement(thisEl.find('[name=brid]')),
            }
          }
        ];
        var call = [
          (input)=>{
            var cred = input[0].content.credited;
            var pay = input[0].content.payment;
            data.sum = (pay - cred)<0 ? 0 : pay-cred;
          }
        ];
        Request.wait();
        mxhRequest(out,call);
        // if (! data.sum) {
        //   var rsid = getValElement(thisEl.find('#on_report [name=rsid]'));
        //   if (rsid) {
        //     thisEl.find('.reportbox').report('option','whenReceived',(inp)=>{
        //       var script =  getValElement(thisEl.find('#on_report [name=script]'));
        //       try {
        //         var amount = inp.amount[0].amount;
        //         script = script.replace('RESULT',String(amount));
        //         data.sum = eval(script);
        //       } catch (e) {
        //         alert('Attention! Failed to execute script to calculate the amount based on the report.\n'+e);
        //       }
        //     });
        //     Request.wait();
        //     thisEl.find('.reportbox').report('send');
        //   }
        // }
        return data
      }

      var showTab = (ev,ui)=>{
        if (ev.currentTarget.hash == "#performance") {
          thisEl.find('#transactions').journal('applyFilter',0);
          this.element.find('#performance #new-element').data({ importData: getData() });
        }
      }
      thisEl.find('.formtabs').wintabs( "option","activate", showTab);
    }



    }
}




var transactions_form =  {
  // curPresID:1, //current preset id
  // curPreset: null, //current preset
  _destExtLink:'',
  _sourceExtLink:'',
  _reserveCassaBox:{},
  whenEndLoad:function () {
      // var tfidEl = this.element.find('[name=tfid]');
      // var tfid = getValElement(tfidEl);
      // if (!tfid) {
      //   tfidEl.text(this.curPresID);
      // }else{
      //   this.curPresID = Number(tfid);
      // }
      // if ('transactions_formpreset' in serviceData.presets) {
      //   for (var i = 0; i < serviceData.presets.transactions_formpreset.length; i++) {
      //     if (serviceData.presets.transactions_formpreset[i].tfid == this.curPresID) {
      //       this.curPreset = serviceData.presets.transactions_formpreset[i];
      //       this.settingApp();
      //     }
      //   }// закончить установку событий
      // }
      // var data = $(this.element.form('option','relationshipElement','prevObject')).data()
      // console.log('data',this.element.form('option','relationshipElement').data());


      // load from external source
      var data = this.element.form('option','relationshipElement').data();
      if ('importData' in data) {

        for (var el in data.importData) {
          if (el == 'sum') {
            this.element.find('[name=plus],[name=minus]').val(Number(data.importData.sum));
          }else{
            this.element.find('[name='+el+']').text(data.importData[el]);
          }
        }
        this.element.find('[name=sourceside]').attr('data-side',data.importData.sourceside);
        this.element.find('[name=destside]').attr('data-side',data.importData.destside);
        // console.log('data-hash',this.element.attr('data-hash'));
      }

      // console.log('next ============= ');
      this.settingApp();
      this.element.find('.selectionvalue').changeDiv(target=>{
        this.whenChanges($(target));
      });

    },

  settingApp:function() {

    var tid = getValElement(this.element.find('[name=tid]'));
    if(tid==''){
      this.element.find('[name=accept]').checkbox('option','checked',true);
      var date = new Date();
      var dt = date.toISOString().substr(0, 10);
      var tm = date.toTimeString().substr(0, 5);
      this.element.find('[name=tdate]').val(dt+' '+tm);
      var curUs = serviceData.currentUser;
      this.element.find('[name=uid]').text(curUs.uid);
      this.element.find('[name=login]').text(curUs.login);
    }


    // if (this.curPreset.lsource) {
    //   this.element.find('#btn-source').attr('data-links',this.curPreset.lsource);
    // }
    // if (this.curPreset.ldest) {
    //     this.element.find('#btn-dest').attr('data-links',this.curPreset.ldest);
    // }


    // temp_function //set the value of cassa
    if (tid=='') {
        this.element.find('[name=scassa],[name=dcassa]').text(serviceData.currentUser.uid);
    };
    this.element.find('#btScassaNull').click(()=>{
      this.element.find('[name=scassa]').text(0);
    });
    this.element.find('#btDcassaNull').click(()=>{
      this.element.find('[name=dcassa]').text(0);
    });
    this.dependenceSideUsebal('read');
    this.setExstraFilter();
  },

    dependenceSideUsebal:function(mode) {
      // mode =  'read' 'set'
    /* устанавливает отношение minus и plus в зависимости от настроек account*/
      var minusEl = this.element.find('[name=minus]');
      var plusEl = this.element.find('[name=plus]');
      var sourceside = getValElement(this.element.find('[name=sourceside]')).trim();
      var sourceusebal = getValElement(this.element.find('[name=sourceusebal]')).trim();
      var destside = getValElement(this.element.find('[name=destside]')).trim();
      var destusebal = getValElement(this.element.find('[name=destusebal]')).trim();
      var sourcecurr = getValElement(this.element.find('[name=sourcecurr]'));
      var destcurr = getValElement(this.element.find('[name=destcurr]'));
      var descr = this.element.find('[name=descr]');
      var amountLabEl =this.element.find('#lb_amount');



      this.element.find('[name=tcurr]').val(sourcecurr).trigger("chosen:updated");
      // console.log('source side/usebal/curr',sourceside,sourceusebal,sourcecurr);
      // console.log('dest   side/usebal/curr',destside,destusebal,destcurr);



      if (sourceside==0) {
        minusEl.removeAttr('hidden')
      }else{
        minusEl.attr('hidden','hidden');
      };

      if (destside==1) {
        plusEl.attr('hidden','hidden');
      }

      if (sourcecurr&&destcurr) {
        if ((destside==0)&&(sourcecurr!=destcurr)){
          plusEl.removeAttr('hidden');
        }else if ((destside==0)&&(sourcecurr==destcurr)){
          plusEl.attr('hidden','hidden');
        }
      }
      if ((sourceside==1)&&(destside==0)) {
        plusEl.removeAttr('hidden','hidden');
      }



      if( (sourceside)&&(destside)&& (sourcecurr)&&(destcurr)){
        if((sourceside==0)&&(destside==0)&&(sourcecurr==destcurr)){
          amountLabEl.text( 'transfer');
        }else if ((sourceside==0)&&(destside==0)&&(sourcecurr!=destcurr)){
          amountLabEl.text( 'currency_exchange');
        }else if ((sourceside==0)&&(destside==1)){
          amountLabEl.text( 'amount_debited');
        }else if ((sourceside==1)&&(destside==0)){
          amountLabEl.text( 'replenishment_amount');
        }
      }
      // console.log('amountLabEl ======= ',amountLabEl.text());
      amountLabEl.text( serviceData.wordTranslate(amountLabEl.text())[0] );

      if (mode=='set') {
          if (sourceusebal==0) {
              // minusEl.attr('hidden','hidden');
              if (minusEl.val()!=0) {
                alert('Внимание. minus = 0.');
              }
              minusEl.val(0);
          }


          if (destusebal==0) {
              if (plusEl.val()!=0) {
                alert('Внимание. plus = 0.');
              }
              plusEl.val(0);
            }

          if ((sourceside==0)&&
              (destside==0)&&
              (sourceusebal==1)&&
              (destusebal==1)
              ){
                minusEl.change(function() {
                  if (destcurr==sourcecurr) {
                    plusEl.val(minusEl.val());
                  }else{
                    descr.val('exchange rate ');
                  }
                });
                plusEl.change(function() {
                  if (destcurr==sourcecurr) {
                    minusEl.val(plusEl.val());
                  }else{
                    descr.val('exchange rate ');
                  }
                });
              }else{
                minusEl.unbind();
                plusEl.unbind();
          }

        }





    },

  setExstraFilter:function() {
    /*Additional filter settings,
    so that if you select one 'account',
    it was not visible in the list for
    selecting another 'account'*/
    var source = Number(getValElement(this.element.find('[name=source]')));
    var dest = Number(getValElement(this.element.find('[name=dest]')));
    var sourcecurr = getValElement(this.element.find('[name=sourcecurr]'));


    var thisEl = this.element;
    function  toChangeCassaBox(address,uid,login){
      var row = '<div class = "row">'+
        '<div name="'+address[0]+'cassa" '+
        'class = "main link ripple dialog" '+
          'data-typedialog = "form" '+
          'data-href="/users_form/?uid='+uid+'" '+
          'data-asname = "uid" >'+uid+'</div>'+
        '<div name="'+address[0]+'login" data-asname = "login">'+login+'</div></div>';
      var box = thisEl.find('#'+address);
      var tid = getValElement(thisEl.find('[name=tid]'));
      if (!tid) {
        box.empty();
        box.append(row);
        box.ini();
      }
    }

    if (source) {
      let btDest = $('#btn-dest');
      let links = btDest.attr('data-links');
      let exstraSet = 'accounts.aid <> '+source+' && accounts.curr = '+sourcecurr;
      if (this._destExtLink) {
        links = links.replace(this._destExtLink,exstraSet);
      }else{
        if (links=='') {
          links = links + ' '+ exstraSet;
        }else{
          links = links +' && '+ exstraSet;
        }
      }
      this._destExtLink = exstraSet;
      btDest.attr('data-links',links);
      // set cassa
      let sourceside =  Number(getValElement(this.element.find('[name=sourceside]')));
      if (sourceside==0) {
          toChangeCassaBox('scassa',serviceData.currentUser.uid,serviceData.currentUser.login);
      }else if (sourceside==1){
        toChangeCassaBox('scassa',0,'root');
      }
    }
    if (dest) {
      let btSource = $('#btn-source');
      let links = btSource.attr('data-links');
      let exstraSet = 'accounts.aid <> '+dest;
      if (this._sourceExtLink) {
        links = links.replace(this._sourceExtLink,exstraSet);
      }else{
        if (links=='') {
            links = links + ' '+ exstraSet;
        }else{
          links = links +' && '+ exstraSet;
        }
      }
      this._sourceExtLink = exstraSet;
      btSource.attr('data-links',links);
      //set cassa
      let destside =  Number(getValElement(this.element.find('[name=destside]')));
      if (destside==0) {
          toChangeCassaBox('dcassa',serviceData.currentUser.uid,serviceData.currentUser.login);
      }else if (destside==1){
        toChangeCassaBox('dcassa',0,'root');
      }
    }
    var sourceside = Number(getValElement(this.element.find('[name=sourceside]')));
    var destside = Number(getValElement(this.element.find('[name=destside]')));
    if ((sourceside==0)&&(destside==0)) {
      this.element.find('.sc,.dc').removeClass('disabled');
    }else{
      this.element.find('.sc,.dc').addClass('disabled');
    }
  },

  whenChanges:function(el) {
    var name = el.attr('name');
    var id = el.attr('id');
    if ((!name)&&(!id)) {
      name = el.closest('[name]').attr('name');
    }
    if ((id=='source')||(id=='dest')) {
      this.dependenceSideUsebal('set');
      this.setExstraFilter();
    }
  }
};
