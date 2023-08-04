function fcheck(e) {

  var sheet = e.source.getActiveSheet();
  var row = e.range.getRow();
  var col = e.range.getColumn();
  var bgc = sheet.getRange(row, col).getBackground();
  if (bgc == "#b7b7b7") { return; }//灰色ならスルー
  if (e.value == e.oldValue) { return; }

  var sheetkasyo = getSheetBySperadGid(e.source, gid_h_fcheckPlace);//h_鮮度箇所
  var sheetlog = getSheetBySperadGid(e.source, gid_h_fcheck);//h_鮮度今日

  //氏名手動入力
  if (row == 1 && col == 8) {
    simeiFunc("", e.value, e.source, sheet, 1, 8, 1, 10);
    return;
  }

  //氏名自動入力
  if (e.value == "実行しました。") {

    var simei = userProps.getProperty("simei");
    Logger.log("getprop " + simei);

    if (simei == null) {//氏名未入力エラー
      sheet.getRange(row, col).setValue(e.oldValue);//元に戻す
      simeiFunc("未入力", "", e.source, sheet, 1, 8, 1, 10);
      return;
    }

    var taskname = sheetkasyo.getRange(row, col).getValue();

    //ログをメモに追加
    var info = sheet.getRange(row, col).getNote();
    info = today_ymddhm + " " + simei + "\n" + info;
    info = stRowCut(info, 5);
    sheet.getRange(row, col).setNote(info);//誤入力のことを考えて編集可能とする

    //ログシートに追加
    var logary = [[today_ymddhm, simei, row, col, taskname]];
    addLogLast(sheetlog, logary, 5);

    sheet.getRange(1, 10).setValue(taskname + "(" + simei + ")" + "ログ済");
    sheet.getRange(1, 10).setBackground(null);//白背景に

    sheet.getRange(row, col).setValue("未");
    sheet.getRange(row, col).setBackground(null);//白背景に

  }

}
