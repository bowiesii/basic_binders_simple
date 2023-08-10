function wtask(e) {

  var sheet = e.source.getActiveSheet();
  var row = e.range.getRow();
  var col = e.range.getColumn();
  var bgc = sheet.getRange(row, col).getBackground();
  if (bgc == "#b7b7b7") { return; }//灰色ならスルー
  if (e.value == e.oldValue) { return; }

  var sheetlog = getSheetBySperadGid(e.source, gid_h_log);//統合ログ

  //氏名手動入力
  if (row == 5 && col == 2) {
    simeiFunc("", e.value, e.source, sheet, 5, 2, 5, 3);
    return;
  }

  var simei = userProps.getProperty("simei");
  Logger.log("getprop " + simei);

  if (simei == null) {//氏名未入力エラー
    sheet.getRange(row, col).setValue(e.oldValue);//元に戻す
    simeiFunc("未入力", "", e.source, sheet, 5, 2, 5, 3);
    return;
  }

  //管理者だったら、氏名以外トリガーしない
  if (e.user.getEmail() == "youseimale@gmail.com") { return; }

  if (col == 1) {//タスク列の編集
    var logary = [today_ymddhm, simei, sheet.getSheetName(), "タスク列編集", "", e.oldValue, e.value, sheet.getSheetId(), row, col];
    addLogLast(sheetlog, [logary], 10);
    return;
  }

  var taskname = sheet.getRange(row, 1).getDisplayValue();//タスク名

  if (col == 2) {//進捗の編集

    //ログ→当該シートのメモ
    var info = sheet.getRange(row, 3).getNote();
    var info2 = sheet.getRange(row, 4).getNote();
    info = today_ymddhm + " " + simei + " " + e.oldValue + "->" + e.value + "\n" + info;
    info2 = today_ymddhm + "#" + simei + "#" + e.oldValue + "#" + e.value + "\n" + info2;//隠し列に記録
    Logger.log(info);
    sheet.getRange(row, 3).setNote(info);
    sheet.getRange(row, 4).setNote(info2);//隠し列
    sheet.getRange(5, 3).setValue(taskname + "(" + simei + ")" + "ログ済");
    sheet.getRange(5, 3).setBackground(null);//白背景に

    //一時ログ
    var logary = [today_ymddhm, simei, sheet.getSheetName(), "進捗", taskname, e.oldValue, e.value, sheet.getSheetId(), row, col];
    addLogLast(sheetlog, [logary], 10);
    return;
  }

  if (col == 3) {//備考欄の編集
    var logary = [today_ymddhm, simei, sheet.getSheetName(), "備考欄編集", taskname, e.oldValue, e.value, sheet.getSheetId(), row, col];
    addLogLast(sheetlog, [logary], 10);
    return;
  }

}
