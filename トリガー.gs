function onEdit(e) {

  const thisSpreadSheet = e.source;//spreadsheetオブジェクト
  var sheetName = e.source.getSheetName();
  var gid = getGIDbysheetname(thisSpreadSheet, sheetName);

  //ソースのシートgidで振り分け
  if (gid == gid_wtask1 || gid == gid_wtask2 || gid == gid_wtask3) {//週タスク
    wtask(e);
  }



}
