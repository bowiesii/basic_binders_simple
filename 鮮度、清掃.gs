//清掃、鮮度共用
function kasyo_check(e) {

  var sheet = e.source.getActiveSheet();
  var row = e.range.getRow();
  var col = e.range.getColumn();
  var bgc = sheet.getRange(row, col).getBackground();
  if (bgc == "#b7b7b7") { return; }//灰色ならスルー
  if (e.value == e.oldValue) { return; }
  var { shiftDay, shiftName } = shiftDN();

  var sheetkasyo = getSheetBySperadGid(e.source, gid_h_place);//h_地図箇所
  var sheetlog = getSheetBySperadGid(e.source, gid_h_log);//統合ログ

  //氏名手動入力
  if (row == 1 && col == 8) {
    simeiFunc("", e.value, e.source, sheet, 1, 8, 1, 10);
    return;
  }

  //氏名自動入力
  if (e.value == "実行しました。") {

    var simei = userProps.getProperty("simei");
    var simeiN = userProps.getProperty("simeiN");
    Logger.log("getprop " + simei + " " + simeiN);

    if (simei == null) {//氏名未入力エラー
      sheet.getRange(row, col).setValue(e.oldValue);//元に戻す
      simeiFunc("未入力", "", e.source, sheet, 1, 8, 1, 10);
      return;
    }

    //管理者だったら、氏名以外トリガーしない
    if (e.user.getEmail() == "youseimale@gmail.com") { return; }

    var taskname = sheetkasyo.getRange(row, col).getValue();

    //ログをメモに追加
    var info = sheet.getRange(row, col).getNote();
    info = today_ymddhm + " " + simei + "\n" + info;
    info = stRowCut(info, 5);
    sheet.getRange(row, col).setNote(info);//誤入力のことを考えて編集可能とする

    //ログシートに追加（ポイント一律）
    var logary = [today_ymddhm, shiftDay, shiftName, "", simei, simeiN, sheet.getSheetName(), "", taskname, e.oldValue, e.value, 3, sheet.getSheetId(), row, col];
    addLogLast(sheetlog, [logary], 15);

    sheet.getRange(1, 10).setValue(taskname + "(" + simei + ")" + "ログ済");
    sheet.getRange(1, 10).setBackground(null);//白背景に

    sheet.getRange(row, col).setValue("未");
    sheet.getRange(row, col).setBackground(null);//白背景に

  }

}
