function wtask(e, simei, simeiN) {

  var sheet = e.source.getActiveSheet();
  var row = e.range.getRow();
  var col = e.range.getColumn();
  if (e.value == e.oldValue) { return; }

  var { shiftDay, shiftName } = shiftDN();
  var sheetLogAll = getSheetBySperadGid(e.source, gid_h_log);//h_統合ログ（管理者以外）一時

  if (col == 1) {//タスク列の編集
    var logary = [today_ymddhm, shiftDay, shiftName, "", simei, simeiN, sheet.getSheetName(), "タスク列編集", "", e.oldValue, e.value, 0, sheet.getSheetId(), row, col];
    addLogLast(sheetLogAll, [logary], 15);
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
    addLogLast(sheetLogAll, [logary], 15);
    return;
  }

  if (col == 3) {//備考欄の編集
    var logary = [today_ymddhm, shiftDay, shiftName, "", simei, simeiN, sheet.getSheetName(), "備考欄編集", taskname, e.oldValue, e.value, 0, sheet.getSheetId(), row, col];
    addLogLast(sheetLogAll, [logary], 15);
    return;
  }

}
