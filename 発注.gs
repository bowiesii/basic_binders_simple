function order(e) {
  var sheet = e.source.getActiveSheet();
  var row = e.range.getRow();
  var col = e.range.getColumn();
  var bgc = sheet.getRange(row, col).getBackground();
  if (bgc == "#b7b7b7") { return; }//灰色ならスルー
  if (e.value == e.oldValue) { return; }

  //※なお氏名は未入力でも発注は引継ぎ可能。
  var simei = userProps.getProperty("simei");
  var simeiN = userProps.getProperty("simeiN");
  Logger.log("getprop " + simei + " " + simeiN);

  //管理者だったらログもしない
  if (e.user.getEmail() == "youseimale@gmail.com") { return; }

  var sheetlog = getSheetBySperadGid(e.source, gid_h_log);//一時ログ
  var type = sheet.getRange(row, 1).getDisplayValue() + "の朝〆";//〆日（行）
  var taskname = sheet.getRange(2, col).getDisplayValue();//何を発注（列）

  //ポイント
  var change = 0;
  change = quantify("発注", e.value) - quantify("発注", e.oldValue);

  //ログだけやっとく
  var logary = [today_ymddhm, simei, simeiN, sheet.getSheetName(), type, taskname, e.oldValue, e.value, change, sheet.getSheetId(), row, col];
  addLogLast(sheetlog, [logary], 12);
  return;

}
