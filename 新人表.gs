function sinjin(e, simei, simeiN) {

  var sheet = e.source.getActiveSheet();
  var row = e.range.getRow();
  var col = e.range.getColumn();
  if (e.value == e.oldValue) { return; }

  var { shiftDay, shiftName } = shiftDN();
  var sheetLogAll = getSheetBySperadGid(e.source, gid_h_log);//h_統合ログ（管理者以外）一時

  sheet.getRange(3, 4).setNote(today_ymd);//最終更新をメモに記録

  if (col == 1) {//スキル列の編集
    var logary = [today_ymddhm, shiftDay, shiftName, "", simei, simeiN, sheet.getSheetName(), "スキル列編集", "", e.oldValue, e.value, 0, sheet.getSheetId(), row, col];
    addLogLast(sheetLogAll, [logary], 15);
    return;
  }

  var taskname = sheet.getRange(row, 1).getDisplayValue();//スキル名

  if (col == 2) {//進捗の編集

    //ログ→当該シートのメモ
    var info = sheet.getRange(row, 3).getNote();
    info = today_ymddhm + " " + simei + " " + e.oldValue + "->" + e.value + "\n" + info;
    Logger.log(info);
    sheet.getRange(row, 3).setNote(info);

    //ポイント
    var change = 0;
    if (taskname.replace(/\s/g, "") != "") {//スキル列空白はスルー
      change = quantify("新人", e.value) - quantify("新人", e.oldValue);
    }

    //ログ→h_新人
    var logary = [today_ymddhm, shiftDay, shiftName, "", simei, simeiN, sheet.getSheetName(), "習得", taskname, e.oldValue, e.value, change, sheet.getSheetId(), row, col];
    addLogLast(sheetLogAll, [logary], 15);
    return;
  }

  if (col == 3) {//備考欄の編集
    var logary = [today_ymddhm, shiftDay, shiftName, "", simei, simeiN, sheet.getSheetName(), "備考欄編集", taskname, e.oldValue, e.value, 0, sheet.getSheetId(), row, col];
    addLogLast(sheetLogAll, [logary], 15);
    return;
  }

}
