function onEdit(e) {

  var sheetName = e.source.getSheetName();
  var gid = getGIDbysheetname(e.source, sheetName);//e.sourceはこのスプレッドリートオブジェクト

  //ソースのシートgidで振り分け
  if (gid == gid_order) {//発注
    order(e);
  }

  if (gid == gid_wtask1 || gid == gid_wtask2 || gid == gid_wtask3) {//週タスク
    wtask(e);
  }

  if (gid == gid_fcheck || gid == gid_clean) {//鮮度清掃
    kasyo_check(e);
  }

  if (sheetName.includes("【新】")) {//新人表用（シート名で判断）
    sinjin(e);
  }

}
