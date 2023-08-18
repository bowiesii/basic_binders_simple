//編集トリガー
function onEdit(e) {

  //管理者だったらトリガーしない
  if (e.user.getEmail() == "youseimale@gmail.com") {
    return;
  }

  var sheetName = e.source.getSheetName();
  var gid = getGIDbysheetname(e.source, sheetName);//※e.sourceはこのスプレッドリートオブジェクト

  var simei = userProps.getProperty("simei");
  var simeiN = userProps.getProperty("simeiN");
  Logger.log("getprop " + simei + " " + simeiN);

  if (gid == gid_simei) {//氏名シートだった場合
    simeiFunc(e, simei, simeiN);
    return;
  }

  if (simei == null) {//氏名未入力エラー
    e.range.setValue(e.oldValue);//★元に戻す
    Logger.log("no_simei_error");
    let logary = [[today_ymddhm, "未入力", "", "", e.source.getActiveSheet().getSheetName(), simeiN]];//氏名ログ一時
    addLogLast(getSheetBySperadGid(e.source, gid_h_simei), logary, 6);
    return;
  }

  if (gid == gid_order) {//発注
    order(e, simei, simeiN);
  }

  if (gid == gid_wtask1 || gid == gid_wtask2 || gid == gid_wtask3) {//週タスク
    wtask(e, simei, simeiN);
  }

  if (gid == gid_fcheck || gid == gid_clean) {//鮮度清掃
    kasyo_check(e, simei, simeiN);
  }

  if (sheetName.includes("【新】")) {//新人表用（シート名で判断）
    sinjin(e, simei, simeiN);
  }

  SpreadsheetApp.flush();//画面更新する

  Logger.log("end");

}
