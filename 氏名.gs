//実行者氏名関連 オプション（未入力の場合"未入力"）、入力された氏名、スプシ、シート、氏名入力欄(rc)、通知欄(rc)
function simeiFunc(opt, input, spreadSheet, sheet, sR, sC, nR, nC) {

  var simeiRan = sheet.getRange(sR, sC);
  var notifyRan = sheet.getRange(nR, nC);
  var logsheet = getSheetBySperadGid(spreadSheet, gid_h_simei);//氏名ログ一時
  var nowsheet = getSheetBySperadGid(spreadSheet, gid_h_simeiNow);//氏名現在

  var oldsimei = userProps.getProperty("simei");//ない場合nullを返す
  var simeiN = userProps.getProperty("simeiN");//一度入力すると修正不可の番号
  Logger.log("input " + input);
  Logger.log("oldsimei " + oldsimei);
  Logger.log("simeiN " + simeiN);

  if (opt == "未入力") {//氏名が未入力だったとき
    //当シート
    notifyRan.setValue("氏名未入力です！" + "\n" + "(ログ未記録)");
    notifyRan.setBackground("red");//赤背景に
    Logger.log("no_simei_error");
    //氏名ログ一時
    let logary = [[today_ymddhm, "未入力", "", "", sheet.getSheetName(), simeiN]];//ログ
    addLogLast(logsheet, logary, 6);
    return;
  }

  if (input == null || input == undefined || input == "") {//だと.lengthがエラーになるため
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

  if (input.includes("店")) {
    simeiRan.setValue("");
    notifyRan.setValue("文字「店」は禁止です。");
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
  var dup_input = searchInCol(nowsheet, 2, input);//inputが現在氏名２列目にあるか（あればシート行数、なければ-1）
  var dup_simeiN = searchInCol(nowsheet, 4, simeiN);//simeiNが現在氏名４列目にあるか（あればシート行数、なければ-1）
  Logger.log("dup_input " + dup_input);
  Logger.log("dup_simeiN " + dup_simeiN);

  //店機器だったら氏名に"店_"を付加
  if (simeiN == 3) {
    input = "店_" + input;
  }

  if (input == oldsimei) {
    simeiRan.setValue("");
    notifyRan.setValue("氏名入力は１度でOKです。");
    notifyRan.setBackground(null);//白背景に
    return;
  }

  if (input == "null" || input == "店_null") {//氏名をリセットする
    //現在氏名★
    if (dup_simeiN != -1) {//現在氏名シートにsimeiNがあれば★削除せず、simei列を""にする※４行目は不変
      let nowary = [today_ymddhm, "", oldsimei];
      nowsheet.getRange(dup_simeiN, 1, 1, 3).setValues([nowary]);//書き込み
    }
    //当シート
    simeiRan.setValue("");
    notifyRan.setValue("リセットしました。");
    notifyRan.setBackground(null);//白背景に
    //氏名ログ一時
    let logary = [[today_ymddhm, "リセット", oldsimei, "", sheet.getSheetName(), simeiN]];//ログ
    addLogLast(logsheet, logary, 6);
    //セット★
    userProps.deleteProperty("simei");//simeiはnullになる。※他のユーザーまでリセットされるわけではない★simeiNは残る。
    return;
  }

  if (dup_input != -1) {//inputがリストにあった場合、別の氏名を要求（※oldsimeiと同一の可能性は既に排除されている）
    //当シート
    simeiRan.setValue("");
    notifyRan.setValue("氏名（" + input + "）は既に使われています。");
    notifyRan.setBackground(null);//白背景に
    //氏名ログ一時
    let logary = [[today_ymddhm, "重複", oldsimei, input, sheet.getSheetName(), simeiN]];//ログ
    addLogLast(logsheet, logary, 6);
    return;
  }

  if (dup_simeiN != -1) {//simeiNがリストにあった場合、現在氏名シートを変更し、simeiを変更
    //現在氏名★
    let nowary = [today_ymddhm, input, oldsimei];
    nowsheet.getRange(dup_simeiN, 1, 1, 3).setValues([nowary]);//現在氏名シートの該当行を変更
    //当シート
    simeiRan.setValue("");
    notifyRan.setValue("氏名変更(" + oldsimei + "→" + input + ")");
    notifyRan.setBackground(null);//白背景に
    //氏名ログ一時
    let logary = [[today_ymddhm, "変更", oldsimei, input, sheet.getSheetName(), simeiN]];//ログ
    addLogLast(logsheet, logary, 6);
    //セット★
    userProps.setProperty("simei", input);
    return;
  }

  //simeiNがリストに無く、simeiを新規にセットする場合
  //まずsimeiNを決める
  var new_simeiN = nowsheet.getLastRow();//行を消すことはないからこれなら平気
  //現在氏名★
  var nowary = [today_ymddhm, input, "", new_simeiN];
  addLogLast(nowsheet, [nowary], 4);//現在リストに追加
  //当シート
  simeiRan.setValue("");
  notifyRan.setValue("氏名新規(" + input + ")");
  notifyRan.setBackground(null);//白背景に
  //氏名ログ一時
  var logary = [[today_ymddhm, "新規", "", input, sheet.getSheetName(), new_simeiN]];//ログ
  addLogLast(logsheet, logary, 6);
  //セット★
  userProps.setProperty("simei", input);
  userProps.setProperty("simeiN", new_simeiN);


  return;

}
