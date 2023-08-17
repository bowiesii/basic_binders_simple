//氏名シートでトリガー
function simeiFunc(e, oldsimei, simeiN) {

  var sheet = e.source.getActiveSheet();
  var row = e.range.getRow();
  var col = e.range.getColumn();
  if (e.value == e.oldValue) { return; }

  //氏名手動入力
  if (row == 3 && col == 2) {

    var input = e.value;

    var simeiRan = sheet.getRange(3, 2);
    var notifyRan = sheet.getRange(4, 2);
    var sheetLogSimei = getSheetBySperadGid(e.source, gid_h_simei);//氏名ログ一時
    var sheetNowSimei = getSheetBySperadGid(e.source, gid_h_simeiNow);//氏名現在リスト

    Logger.log("input " + input);
    Logger.log("oldsimei " + oldsimei);
    Logger.log("simeiN " + simeiN);

    if (input == null || input == undefined || input == "") {//だと.lengthがエラーになるため
      simeiRan.setValue("");
      notifyRan.setValue("２～８文字で指定下さい。");
      return;
    }

    if (input.length <= 1 || input.length >= 9) {
      simeiRan.setValue("");
      notifyRan.setValue("２～８文字で指定下さい。");
      return;
    }

    if (input.includes("#") || input.includes("店") || input.includes("\n")) {
      simeiRan.setValue("");
      notifyRan.setValue("文字「#」「店」「改行」は禁止です。");
      return;
    }

    //以下は氏名入力欄にまともに入力された場合
    var dup_input = searchInCol(sheetNowSimei, 2, input);//inputが現在氏名２列目にあるか（あればシート行数、なければ-1）
    var dup_simeiN = searchInCol(sheetNowSimei, 4, simeiN);//simeiNが現在氏名４列目にあるか（あればシート行数、なければ-1）
    Logger.log("dup_input " + dup_input);
    Logger.log("dup_simeiN " + dup_simeiN);

    //店機器だったら氏名に"店_"を付加
    if (simeiN == 3) {
      input = "店_" + input;
    }

    if (input == oldsimei) {
      simeiRan.setValue("");
      notifyRan.setValue("氏名入力は１度でOKです。");
      return;
    }

    if (input == "null" || input == "店_null") {//氏名をリセットする
      //氏名リスト★
      if (dup_simeiN != -1) {//現在氏名シートにsimeiNがあれば★削除せず、simei列を""にする※４行目は不変
        let nowary = [today_ymddhm, "", oldsimei];
        sheetNowSimei.getRange(dup_simeiN, 1, 1, 3).setValues([nowary]);//書き込み
      }
      //当シート
      simeiRan.setValue("");
      notifyRan.setValue("リセットしました。");
      //氏名ログ一時
      let logary = [[today_ymddhm, "リセット", oldsimei, "", sheet.getSheetName(), simeiN]];//ログ
      addLogLast(sheetLogSimei, logary, 6);
      //セット★
      userProps.deleteProperty("simei");//simeiはnullになる。※他のユーザーまでリセットされるわけではない★simeiNは残る。
      return;
    }

    if (dup_input != -1) {//inputがリストにあった場合、別の氏名を要求（※oldsimeiと同一の可能性は既に排除されている）
      //当シート
      simeiRan.setValue("");
      notifyRan.setValue("氏名（" + input + "）は既に使われているので他の氏名を入力して下さい。");
      //氏名ログ一時
      let logary = [[today_ymddhm, "重複", oldsimei, input, sheet.getSheetName(), simeiN]];//ログ
      addLogLast(sheetLogSimei, logary, 6);
      return;
    }

    if (dup_simeiN != -1) {//simeiNがリストにあった場合、現在氏名シートを変更し、simeiを変更
      //氏名リスト★
      let nowary = [today_ymddhm, input, oldsimei];
      sheetNowSimei.getRange(dup_simeiN, 1, 1, 3).setValues([nowary]);//現在氏名シートの該当行を変更
      //当シート
      simeiRan.setValue("");
      notifyRan.setValue("氏名を変更しました。(" + oldsimei + "→" + input + ")");
      //氏名ログ一時
      let logary = [[today_ymddhm, "変更", oldsimei, input, sheet.getSheetName(), simeiN]];//ログ
      addLogLast(sheetLogSimei, logary, 6);
      //セット★
      userProps.setProperty("simei", input);
      return;
    }

    //simeiNがリストに無く、simeiを新規にセットする場合
    //まずsimeiNを決める
    var new_simeiN = sheetNowSimei.getLastRow();//行を消すことはないからこれなら平気
    //氏名リスト★
    var nowary = [today_ymddhm, input, "", new_simeiN];
    addLogLast(sheetNowSimei, [nowary], 4);//現在リストに追加
    //当シート
    simeiRan.setValue("");
    notifyRan.setValue("氏名を新規にセットしました。(" + input + ")");
    //氏名ログ一時
    var logary = [[today_ymddhm, "新規", "", input, sheet.getSheetName(), new_simeiN]];//ログ
    addLogLast(sheetLogSimei, logary, 6);
    //セット★
    userProps.setProperty("simei", input);
    userProps.setProperty("simeiN", new_simeiN);

  } else {

    e.range.setValue(e.oldValue);//元に戻す（他の説明セル編集された場合）

  }

  return;

}
