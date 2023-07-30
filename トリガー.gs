function onEdit(e) {

  var sheetName = e.source.getSheetName();
  var gid = getGIDbysheetname(thisSpreadSheet, sheetName);

  //多数のセルに同時に代入されたとき対策？？→Rangeはわかるがoldvalueは分からないらしい。

  //ソースのシートgidでfunctionを分けていく。
  if (gid == gid_wtask1 || gid == gid_wtask2 || gid == gid_wtask3) {
    wtask(e);
  }



}
