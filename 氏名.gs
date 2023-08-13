//実行者氏名関連 オプション（未入力の場合"未入力"）、入力された氏名、スプシ、シート、氏名入力欄(rc)、通知欄(rc)
function simeiFunc(opt, input, spreadSheet, sheet, sR, sC, nR, nC) {

  var simeiRan = sheet.getRange(sR, sC);
  var notifyRan = sheet.getRange(nR, nC);
  var logsheet = getSheetBySperadGid(spreadSheet, gid_h_simei);//氏名ログ一時
  var nowsheet = getSheetBySperadGid(spreadSheet, gid_h_simeiNow);//氏名現在

  if (opt == "未入力") {//氏名が未入力だったとき
    notifyRan.setValue("氏名未入力です！" + "\n" + "(ログ未記録)");
    notifyRan.setBackground("red");//赤背景に
    Logger.log("no_simei_error");
    var logary = [[today_ymddhm, "未入力", "", "", sheet.getSheetName()]];//ログ
    addLogLast(logsheet, logary, 5);
    return;
  }

  if (input == null) {//nullだと.lengthがエラーになるため
    simeiRan.setValue("");
    notifyRan.setValue("２～８文字で指定下さい。");
    notifyRan.setBackground(null);//白背景に
    return;
  }

  if (input.length <= 1 || input.length >= 9) {
    simeiRan.setValue("");
    notifyRan.setValue("２～８文字で指定下さい。");
    notifyRan.setBackground(null);//白背景に
    return;
  }

  if (input.includes("#")) {
    simeiRan.setValue("");
    notifyRan.setValue("文字「#」は禁止です。");
    notifyRan.setBackground(null);//白背景に
    return;
  }

  if (input.includes("\n")) {
    simeiRan.setValue("");
    notifyRan.setValue("改行は含めないで下さい。");
    notifyRan.setBackground(null);//白背景に
    return;
  }

  //以下は氏名入力欄にまともに入力された場合
  var oldsimei = userProps.getProperty("simei");//ない場合nullを返す
  Logger.log("input " + input);
  Logger.log("oldsimei " + oldsimei);
  var dup_input = searchInCol(nowsheet, 2, input);//inputが現在氏名にあるか（あればシート行数、なければ-1）
  var dup_oldsimei = searchInCol(nowsheet, 2, oldsimei);//oldsimeiが現在氏名にあるか（あればシート行数、なければ-1）
  Logger.log("dup_input " + dup_input);
  Logger.log("dup_oldsimei " + dup_oldsimei);

  if (input == oldsimei) {
    simeiRan.setValue("");
    notifyRan.setValue("氏名入力は１度でOKです。");
    notifyRan.setBackground(null);//白背景に
    return;
  }

  if (input == "null") {//氏名をリセットする
    if (dup_oldsimei != -1) {//現在氏名シートにoldsimeiがあれば★行を削除する
      var nowary = nowsheet.getRange(2, 1, nowsheet.getLastRow() - 1, 3).getValues();
      nowary.splice(dup_oldsimei - 2, 1);
      nowary.push(["", "", ""]);//削除したぶん空白行を最後に追加
      nowsheet.getRange(2, 1, nowsheet.getLastRow() - 1, 3).setValues(nowary);//書き込み
    }
    userProps.deleteProperty("simei");//simeiはnullになる。※他のユーザーまでリセットされるわけではない
    simeiRan.setValue("");
    notifyRan.setValue("リセットしました。");
    notifyRan.setBackground(null);//白背景に
    var logary = [[today_ymddhm, "リセット", oldsimei, "", sheet.getSheetName()]];//ログ
    addLogLast(logsheet, logary, 5);
    return;
  }

  if (dup_input != -1) {//inputがリストにあった場合、別の氏名を要求（※oldsimeiと同一の可能性は既に排除されている）
    simeiRan.setValue("");
    notifyRan.setValue("氏名（" + input + "）は既に使われています。");
    notifyRan.setBackground(null);//白背景に
    var logary = [[today_ymddhm, "重複", oldsimei, input, sheet.getSheetName()]];//ログ
    addLogLast(logsheet, logary, 5);
    return;
  }

  if (dup_oldsimei != -1) {//oldsimeiがリストにあった場合、現在氏名シートを変更し、simeiを変更
    var nowary = [today_ymddhm, input, oldsimei];
    nowsheet.getRange(dup_oldsimei, 1, 1, 3).setValues([nowary]);//現在氏名シートの該当行を変更
    simeiRan.setValue("");
    notifyRan.setValue("氏名変更(" + oldsimei + "→" + input + ")");
    notifyRan.setBackground(null);//白背景に
    var logary = [[today_ymddhm, "変更", oldsimei, input, sheet.getSheetName()]];//ログ
    addLogLast(logsheet, logary, 5);
    userProps.setProperty("simei", input);
    return;
  }

  //oldsimeiがリストに無く、simeiを新規にセットする場合
  var nowary = [today_ymddhm, input, ""];
  addLogLast(nowsheet, [nowary], 3);//現在リストに追加
  simeiRan.setValue("");
  notifyRan.setValue("氏名新規(" + input + ")");
  notifyRan.setBackground(null);//白背景に
  var logary = [[today_ymddhm, "新規", "", input, sheet.getSheetName()]];//ログ
  addLogLast(logsheet, logary, 5);
  userProps.setProperty("simei", input);
  return;

}
