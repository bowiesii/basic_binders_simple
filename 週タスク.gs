function wtask(e) {

  var sheet = e.source.getActiveSheet();
  var row = e.range.getRow();
  var col = e.range.getColumn();
  if (e.value == e.oldValue) { return; }
  var { shiftDay, shiftName } = shiftDN();

  var sheetlog = getSheetBySperadGid(e.source, gid_h_log);//統合ログ

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

  if (col == 1) {//タスク列の編集
    var logary = [today_ymddhm, shiftDay, shiftName, "", simei, simeiN, sheet.getSheetName(), "タスク列編集", "", e.oldValue, e.value, 0, sheet.getSheetId(), row, col];
    addLogLast(sheetlog, [logary], 15);
    return;
  }

  var taskname = sheet.getRange(row, 1).getDisplayValue();//タスク名

  if (col == 2) {//進捗の編集

    //ログ→当該シートのメモ
    var info = sheet.getRange(row, 3).getNote();
    info = today_ymddhm + " " + simei + " " + e.oldValue + "->" + e.value + "\n" + info;
    Logger.log(info);
    sheet.getRange(row, 3).setNote(info);

    //ポイントを計算
    var change = 0;
    if (taskname.includes("【棚】")) {
      change = quantify("【棚】", e.value) - quantify("【棚】", e.oldValue);
    } else if (taskname == "価格変更") {
      change = quantify("価格変更", e.value) - quantify("価格変更", e.oldValue);
    } else if (taskname.replace(/\s/g, "") != "") {//タスク列空白だったらchange0
      change = quantify("週タスクその他", e.value) - quantify("週タスクその他", e.oldValue);
    }

    //一時ログ
    var logary = [today_ymddhm, shiftDay, shiftName, "", simei, simeiN, sheet.getSheetName(), "進捗", taskname, e.oldValue, e.value, change, sheet.getSheetId(), row, col];
    addLogLast(sheetlog, [logary], 15);
    return;
  }

  if (col == 3) {//備考欄の編集
    var logary = [today_ymddhm, shiftDay, shiftName, "", simei, simeiN, sheet.getSheetName(), "備考欄編集", taskname, e.oldValue, e.value, 0, sheet.getSheetId(), row, col];
    addLogLast(sheetlog, [logary], 15);
    return;
  }

}
