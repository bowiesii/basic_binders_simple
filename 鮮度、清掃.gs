//清掃、鮮度共用
function kasyo_check(e) {

  var sheet = e.source.getActiveSheet();
  var row = e.range.getRow();
  var col = e.range.getColumn();
  if (e.value == e.oldValue) { return; }
  var { shiftDay, shiftName } = shiftDN();

  var sheetkasyo = getSheetBySperadGid(e.source, gid_h_place);//h_地図箇所
  var sheetlog = getSheetBySperadGid(e.source, gid_h_log);//統合ログ

  //氏名自動入力
  if (e.value == "実行しました。") {

    var simei = userProps.getProperty("simei");
    var simeiN = userProps.getProperty("simeiN");
    Logger.log("getprop " + simei + " " + simeiN);

  if (simei == null) {//氏名未入力エラー
    sheet.getRange(row, col).setValue(e.oldValue);//元に戻す
    Logger.log("no_simei_error");
    //氏名ログ一時
    let logary = [[today_ymddhm, "未入力", "", "", sheet.getSheetName(), simeiN]];//ログ
    addLogLast(getSheetBySperadGid(e.source, gid_h_simei), logary, 6);
    return;
  }

    //管理者だったら、氏名以外トリガーしない
    if (e.user.getEmail() == "youseimale@gmail.com") { return; }

    var taskname = sheetkasyo.getRange(row, col).getValue();

    //ログをメモに追加
    var info = sheet.getRange(row, col).getNote();
    info = today_ymddhm + " " + simei + "\n" + info;
    info = stRowCut(info, 5);//古いログを削除
    sheet.getRange(row, col).setNote(info);//誤入力のことを考えて編集可能とする

    //ログシートに追加（ポイント一律）
    var logary = [today_ymddhm, shiftDay, shiftName, "", simei, simeiN, sheet.getSheetName(), "", taskname, e.oldValue, e.value, 3, sheet.getSheetId(), row, col];
    addLogLast(sheetlog, [logary], 15);

    sheet.getRange(row, col).setValue("未");
    sheet.getRange(row, col).setBackground(null);//白背景に

  }

}
