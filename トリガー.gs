function onEdit(e) {

  var sheetName = e.source.getSheetName();
  var gid = getGIDbysheetname(e.source, sheetName);//e.sourceはこのスプレッドリートオブジェクト

  //ソースのシートgidで振り分け
  if (gid == gid_wtask1 || gid == gid_wtask2 || gid == gid_wtask3) {//週タスク
    wtask(e);
  }
  if (gid == fcheck) {//鮮度チェック
    fcheck(e);
  }



}
