function sinjin(e) {

  var sheet = e.source.getActiveSheet();
  var row = e.range.getRow();
  var col = e.range.getColumn();
  var bgc = sheet.getRange(row, col).getBackground();
  if (bgc == "#b7b7b7") { return; }//灰色ならスルー
  if (e.value == e.oldValue) { return; }

  //氏名手動入力
  if (row == 4 && col == 2) {
    simeiFunc("", e.value, e.source, sheet, 4, 2, 4, 3);
    return;
  }

  var simei = userProps.getProperty("simei");
  Logger.log("getprop " + simei);

  if (simei == null) {//氏名未入力エラー
    sheet.getRange(row, col).setValue(e.oldValue);//元に戻す
    simeiFunc("未入力", "", e.source, sheet, 4, 2, 4, 3);
    return;
  }

  sheet.getRange(3, 4).setValue(today_ymd);//最終更新を記録
  var sheetlog = getSheetBySperadGid(e.source, gid_h_sinjin);//h_新人

  if (col == 1) {//スキル列の編集
    var logary = [[today_ymddhm, simei, sheet.getRange(2, 2).getDisplayValue(), "スキル列の編集 " + e.oldValue + "->" + e.value + " 行：" + row, "", "", ""]];
    addLogLast(sheetlog, logary, 7);
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
    sheet.getRange(4, 3).setValue(taskname + "(" + simei + ")" + "ログ済");
    sheet.getRange(4, 3).setBackground(null);//白背景に

    //ログ→h_新人
    var logary = [[today_ymddhm, simei, sheet.getRange(2, 2).getDisplayValue(), "進捗", taskname, e.oldValue, e.value]];
    addLogLast(sheetlog, logary, 7);
    return;
  }

  if (col == 3) {//備考欄の編集
    var logary = [[today_ymddhm, simei, sheet.getRange(2, 2).getDisplayValue(), "備考欄の編集 " + e.oldValue + "->" + e.value + " 行：" + taskname, "", "", ""]];
    addLogLast(sheetlog, logary, 7);
    return;
  }

}
