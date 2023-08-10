function order(e) {
  var sheet = e.source.getActiveSheet();
  var row = e.range.getRow();
  var col = e.range.getColumn();
  var bgc = sheet.getRange(row, col).getBackground();
  if (bgc == "#b7b7b7") { return; }//灰色ならスルー
  if (e.value == e.oldValue) { return; }

  //※氏名は未入力でも発注は引継ぎ可能。（セルに入力するので。。）

  var simei = userProps.getProperty("simei");
  Logger.log("getprop " + simei);

  //管理者だったらログもしない
  if (e.user.getEmail() == "youseimale@gmail.com") { return; }

  var sheetlog = getSheetBySperadGid(e.source, gid_h_log);//一時ログ
  var type = sheet.getRange(row, 1).getDisplayValue();//〆日（行）
  var taskname = sheet.getRange(2, col).getDisplayValue();//何を発注（列）

  //ログだけやっとく
  var logary = [today_ymddhm, simei, sheet.getSheetName(), type, taskname, e.oldValue, e.value, sheet.getSheetId(), row, col];
  addLogLast(sheetlog, [logary], 10);
  return;

}
