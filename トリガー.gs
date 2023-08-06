function onEdit(e) {

  var sheetName = e.source.getSheetName();
  var gid = getGIDbysheetname(e.source, sheetName);//e.sourceはこのスプレッドリートオブジェクト

  //編集カウント（管理者除く）
  if (e.user.getEmail() != "youseimale@gmail.com") {
    editCount(e);
  }

  //ソースのシートgidで振り分け
  if (gid == gid_wtask1 || gid == gid_wtask2 || gid == gid_wtask3) {//週タスク
    wtask(e);
  }

  if (gid == gid_fcheck) {//鮮度チェック
    fcheck(e);
  }

  if(sheetName.includes("【新】")){//新人表用（シート名で判断）
    sinjin(e);
  }



}
