function fcheck(e) {

  var sheet = e.source.getActiveSheet();
  var row = e.range.getRow();
  var col = e.range.getColumn();
  var bgc = sheet.getRange(row, col).getBackground();
  if (bgc == "#b7b7b7") { return; }//灰色ならスルー
  if (e.value == e.oldValue) { return; }

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

    //ログをメモに追加
    var info = sheet.getRange(row, col).getNote();
    info = today_ymddhm + " " + simei + "\n" + info;
    info = stRowCut(info, 5);

    var info2 = sheet.getRange(row, col).getNote();//h_鮮度にメモ追加
    info2 = today_ymddhm + "#" + simei + "\n" + info2;
    info2 = stRowCut(info2, 5);
    


    sheet.getRange(1, 10).setValue("ログ記録しました。");
    sheet.getRange(1, 10).setBackground(null);//白背景に

    sheet.getRange(row, col).setValue("未");
    sheet.getRange(row, col).setBackground(null);//白背景に

  }

}
