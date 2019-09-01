function customScript() {
  $('#upload').change(()=>{
    var floadEl = $('#upload');
    var file = floadEl[0].files[0];

    autoCompleteDocuments(file,'fillContract',{cid:1})
  });


}
