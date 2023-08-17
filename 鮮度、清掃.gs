//清掃、鮮度共用
function kasyo_check(e, simei, simeiN) {

  var sheet = e.source.getActiveSheet();
  var row = e.range.getRow();
  var col = e.range.getColumn();
  if (e.value == e.oldValue) { return; }

  var { shiftDay, shiftName } = shiftDN();
  var sheetLogAll = getSheetBySperadGid(e.source, gid_h_log);//h_統合ログ（管理者以外）一時

  var sheetkasyo = getSheetBySperadGid(e.source, gid_h_place);//h_地図箇所

  if (e.value == "実行しました。") {

    var taskname = sheetkasyo.getRange(row, col).getValue();

    //ログをメモに追加
    var info = sheet.getRange(row, col).getNote();
    info = today_ymddhm + " " + simei + "\n" + info;
    info = stRowCut(info, 5);//古いログを削除
    sheet.getRange(row, col).setNote(info);//誤入力のことを考えて編集可能とする

    //ログシートに追加（ポイント一律）
    var logary = [today_ymddhm, shiftDay, shiftName, "", simei, simeiN, sheet.getSheetName(), "", taskname, e.oldValue, e.value, 3, sheet.getSheetId(), row, col];
    addLogLast(sheetLogAll, [logary], 15);

    sheet.getRange(row, col).setValue("未");
    sheet.getRange(row, col).setBackground(null);//白背景に

  }

}
