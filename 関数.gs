//※シンプルトリガーは編集不可ライブラリは使えない

//氏名関連 オプション（未入力の場合"未入力"）、入力された氏名、スプシ、シート、氏名入力欄(rc)、通知欄(rc)
function simeiFunc(opt, input, spreadSheet, sheet, sR, sC, nR, nC) {

  var simeiRan = sheet.getRange(sR, sC);
  var notifyRan = sheet.getRange(nR, nC);
  var logsheet = getSheetBySperadGid(spreadSheet, gid_h_simei);

  if (opt == "未入力") {//氏名が未入力だったとき

    notifyRan.setValue("氏名未入力です！" + "\n" + "(ログ未記録)");
    notifyRan.setBackground("red");//赤背景に
    Logger.log("no_simei_error");

    //ログ
    var logary = [[today_ymddhm, "未入力", "", "", sheet.getSheetName()]];
    addLogLast(logsheet, logary, 5);

  } else {//氏名入力欄に入力された場合

    if (input == "null") {
      var oldsimei = userProps.getProperty("simei");
      userProps.deleteProperty("simei");//他のユーザーまでリセットされるわけではない
      simeiRan.setValue("");
      notifyRan.setValue("リセットしました。");
      notifyRan.setBackground(null);//白背景に
      //ログ
      var logary = [[today_ymddhm, "リセット", oldsimei, "", sheet.getSheetName()]];
      addLogLast(logsheet, logary, 5);
      return;
    }

    if (input.includes("#")) {
      simeiRan.setValue("");
      notifyRan.setValue("文字「#」は禁止です。");
      notifyRan.setBackground(null);//白背景に
      return;
    }

    if (input.includes("\n")) {
      simeiRan.setValue("");
      notifyRan.setValue("改行は含めないで下さい。");
      notifyRan.setBackground(null);//白背景に
      return;
    }

    if (input.length <= 1 || input.length >= 9) {
      simeiRan.setValue("");
      notifyRan.setValue("２～８文字で指定下さい。");
      notifyRan.setBackground(null);//白背景に
      return;
    }

    //以下、普通に氏名入力された場合
    var oldsimei = userProps.getProperty("simei");
    userProps.setProperty("simei", input);
    Logger.log("setprop " + input);
    simeiRan.setValue("");
    if (oldsimei == null) {
      notifyRan.setValue("氏名設定済(" + input + ")");
      //ログ
      var logary = [[today_ymddhm, "新規", "", input, sheet.getSheetName()]]
      addLogLast(logsheet, logary, 5);
    } else {
      notifyRan.setValue("氏名変更(" + oldsimei + "→" + input + ")");
      //ログ
      var logary = [[today_ymddhm, "変更", oldsimei, input, sheet.getSheetName()]]
      addLogLast(logsheet, logary, 5);
    }
    notifyRan.setBackground(null);//白背景に

  }

}

//シート１（降順）の２行以下全部→シート２（昇順）の２行以下の先頭へログを移動（シート１の２行以下は★クリア）
function replaceLogFirst(sheet1, sheet2) {
  var didnum = sheet1.getLastRow() - 1;//移動させるログの数
  if (didnum >= 1) {//0だとgetrangeがエラーになるので
    var range = sheet1.getRange(2, 1, didnum, sheet1.getLastColumn());
    var logary = range.getDisplayValues().reverse();//降順→昇順なのでreverseで★行逆転
    addLogFirst(sheet2, 2, logary, sheet1.getLastColumn(), 10000);
    //クリア
    range.clearContent();
  }
}

//ログにary行数分記入（★新しいのが上）
//シート、★挿入行（普通は２行目～）、行列（★２次元）、列数（列数に変動があるとエラーになるため定義してほしい）
//※insertrowsやdeleterowsは保護シートでは機能しないため使えない
function addLogFirst(sheet, rowNum, ary, colNum, maxRow) {
  if (ary.length >= 1) {//0だとエラーになるので
    sheet.insertRowsBefore(rowNum, ary.length);
    sheet.getRange(rowNum, 1, ary.length, colNum).setValues(ary);
    if (sheet.getLastRow() >= maxRow + 1) {
      sheet.deleteRows(maxRow + 1, sheet.getLastRow() - maxRow);//maxRow以上ならmaxRow+1以降（古いの）を削除
    }
  }
}

//保護シートでも機能する関数（★事前に十分な行数を用意する前提。）
//ログにary行数分記入（★新しいのが下）
//シート、行列（★２次元）、列数（列数に変動があるとエラーになるため定義してほしい）
function addLogLast(sheet, ary, colNum) {
  if (ary.length >= 1) {//0だとエラーになるので
    sheet.getRange(sheet.getLastRow() + 1, 1, ary.length, colNum).setValues(ary);
  }
}

//文字列の指定行数「より後ろ」をカットする（そんなに行数なければスルーして同じ文字列返す）
//st=文字列、row=行数、結果はrow行になる。
function stRowCut(st, maxRow) {
  var output = "";
  var st_ary = st.split(/\r\n|\n/);
  if (st_ary.length >= maxRow + 1) {
    st_ary.splice(maxRow, st_ary.length - maxRow);
    for (var r = 0; r <= st_ary.length - 1; r++) {
      output = output + st_ary[r] + "\n";
    }
  } else {
    output = st;
  }
  return output;
}

//スプシオブジェクト、シート名→gid（トリガーからGIDで振り分けるのに使う。シート名は変えられるため）
//シート名が含まれなければnull
function getGIDbysheetname(spreadSheet, sheetName) {

  for (let sheet of spreadSheet.getSheets()) {
    if (sheet.getSheetName() === sheetName) {
      return sheet.getSheetId();
    }
  }

  return null;
}


//id,gid →シートオブジェクト
function getSheetByIdGid(id, gid) {
  return getSheetByUrl(toUrl(id, gid));
}

//idとgid→シートのurl
function toUrl(id, gid) {
  var output = "https://docs.google.com/spreadsheets/d/" + id + "/edit#gid=" + gid
  return output;
}

//スプシオブジェクト、GID→シートオブジェクト
function getSheetBySperadGid(spreadSheet, gid) {
  for (const sheet of spreadSheet.getSheets()) {
    if (sheet.getSheetId() === Number(gid)) return sheet
  }
  return null;
}

//url→シートオブジェクト
function getSheetByUrl(url) {
  if (!url) {
    throw "input error"
  }

  // URLの3階層目からスプレッドシートID取得
  const regExpSpreadsheetId = new RegExp("https?://.*?/.*?/.*?/(.*?)(?=/)")
  const spreadsheetId = url.match(regExpSpreadsheetId)[1]

  // gidパラメータからシートID取得
  const regExpGid = new RegExp("gid=(.*?)(&|$)")
  const gid = url.match(regExpGid)[1]

  // 一致するシートオブジェクト取得
  const spreadsheet = SpreadsheetApp.openById(spreadsheetId)
  for (const sheet of spreadsheet.getSheets()) {
    if (sheet.getSheetId() === Number(gid)) return sheet
  }

  return null
}
