function order(e, simei, simeiN) {

  var sheet = e.source.getActiveSheet();
  var row = e.range.getRow();
  var col = e.range.getColumn();
  if (e.value == e.oldValue) { return; }

  var { shiftDay, shiftName } = shiftDN();
  var sheetLogAll = getSheetBySperadGid(e.source, gid_h_log);//h_統合ログ（管理者以外）一時

  var type = sheet.getRange(row, 1).getDisplayValue() + "の朝〆";//〆日（行）
  var taskname = sheet.getRange(2, col).getDisplayValue();//何を発注（列）

  //ポイント
  var change = 0;
  change = quantify("発注", e.value) - quantify("発注", e.oldValue);

  //ログだけやっとく
  var logary = [today_ymddhm, shiftDay, shiftName, "", simei, simeiN, sheet.getSheetName(), type, taskname, e.oldValue, e.value, change, sheet.getSheetId(), row, col];
  addLogLast(sheetLogAll, [logary], 15);
  return;

}
