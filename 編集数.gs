//編集数ログ
function editCount(e) {

  var sheet = e.source.getActiveSheet();
  var sheetlog = getSheetBySperadGid(e.source, gid_h_edit);
  var sheetName = sheet.getSheetName();
  var row = e.range.getRow();
  var col = e.range.getColumn();
  var simei = userProps.getProperty("simei");

  var logary = [today_ymddhm, sheetName, row, col, simei];
  addLogLast(sheetlog, [logary], 5);

}
