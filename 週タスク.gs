function wtask(e) {

  var sheet = e.source.getActiveSheet();
  var row = e.range.getRow();
  var col = e.range.getColumn();
  var bgc = sheet.getRange(row, col).getBackground();
  if (bgc == "#b7b7b7") { return; }//灰色ならスルー
  if (e.value == e.oldValue) { return; }

  //氏名手動入力
  if (row == 5 && col == 2) {

    if (e.value == "null") {
      userProps.deleteProperty("simei");//他のユーザーまでリセットされるわけではない
      sheet.getRange(5, 2).setValue("");
      sheet.getRange(5, 3).setValue("リセットしました。");
      sheet.getRange(5, 3).setBackground(null);//白背景に
      return;
    }

    if (e.value.includes("#")) {
      sheet.getRange(5, 2).setValue("");
      sheet.getRange(5, 3).setValue("文字「#」は禁止です。");
      sheet.getRange(5, 3).setBackground(null);//白背景に
      return;
    }

    if (e.value.includes("\n")) {
      sheet.getRange(5, 2).setValue("");
      sheet.getRange(5, 3).setValue("改行は含めないで下さい。");
      sheet.getRange(5, 3).setBackground(null);//白背景に
      return;
    }

    if (e.value.length <= 1 || e.value.length >= 9) {
      sheet.getRange(5, 2).setValue("");
      sheet.getRange(5, 3).setValue("２～８文字で指定下さい。");
      sheet.getRange(5, 3).setBackground(null);//白背景に
      return;
    }

    var oldsimei = userProps.getProperty("simei");
    userProps.setProperty("simei", e.value);
    Logger.log("setprop " + e.value);
    sheet.getRange(5, 2).setValue("");
    sheet.getRange(5, 3).setValue("氏名入力しました。");
    sheet.getRange(5, 3).setBackground(null);//白背景に

    //入力氏名をメモ
    var simei_log = sheet.getRange(5, 4).getNote();
    simei_log = stRowCut(simei_log, 99);//行数制限
    sheet.getRange(5, 4).setNote(today_ymddhm + "##" + oldsimei + "##" + e.value + "##" + "\n" + simei_log);

    return;

  }


  //氏名自動入力（２列のみ）
  if (col == 2) {

    var simei = userProps.getProperty("simei");
    Logger.log("getprop " + simei);

    if (simei == null) {
      sheet.getRange(row, col).setValue(e.oldValue);
      sheet.getRange(5, 3).setValue("氏名未入力です！" + "\n" + "(ログ未記録)");
      sheet.getRange(5, 3).setBackground("red");//赤背景に
      Logger.log("no_simei_error");

      //氏名未入力エラーをメモ
      var simei_log = sheet.getRange(5, 4).getNote();
      simei_log = stRowCut(simei_log, 99);//行数制限
      sheet.getRange(5, 4).setNote(today_ymddhm + "#氏名未入力#" + row + "#" + col + "\n" + simei_log);

      return;
    }

    //ログを３列目メモに追加
    var taskname = sheet.getRange(row, 1).getDisplayValue();
    var info = sheet.getRange(row, 3).getNote();
    var info2 = sheet.getRange(row, 4).getNote();
    info = today_ymddhm + " " + simei + " " + e.oldValue + "->" + e.value + "\n" + info;
    info2 = today_ymddhm + "#" + simei + "#" + e.oldValue + "#" + e.value + "\n" + info2;//隠し列に記録
    Logger.log(info);
    sheet.getRange(row, 3).setNote(info);
    sheet.getRange(row, 4).setNote(info2);//隠し列
    sheet.getRange(5, 3).setValue(taskname + "(" + simei + ")" + "ログ済");
    sheet.getRange(5, 3).setBackground(null);//白背景に

    return;

  }

}
