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
    var logary = [[today_ymddhm, "未入力", "", "", sheet.getSheetId()]];
    addLogLast(logsheet, logary, 5);

  } else {//氏名入力欄に入力された場合

    if (input == "null") {
      var oldsimei = userProps.getProperty("simei");
      userProps.deleteProperty("simei");//他のユーザーまでリセットされるわけではない
      simeiRan.setValue("");
      notifyRan.setValue("リセットしました。");
      notifyRan.setBackground(null);//白背景に
      //ログ
      var logary = [[today_ymddhm, "リセット", oldsimei, "", sheet.getSheetId()]];
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
      var logary = [[today_ymddhm, "新規", "", input, sheet.getSheetId()]]
      addLogLast(logsheet, logary, 5);
    } else {
      notifyRan.setValue("氏名変更(" + oldsimei + "→" + input + ")");
      //ログ
      var logary = [[today_ymddhm, "変更", oldsimei, input, sheet.getSheetId()]]
      addLogLast(logsheet, logary, 5);
    }
    notifyRan.setBackground(null);//白背景に

  }

}

//ログにary行数分記入する。（★新しいのが上）
//シート、★挿入行（普通は２行目～）、行列（★２次元）、列数（列数に変動があるとエラーになるため定義してほしい）
//※insertrowsやdeleterowsは保護シートでは機能しないため使えない
function addLogFirst(sheet, rowNum, ary, colNum) {
  sheet.insertRowsBefore(rowNum, ary.length);
  sheet.getRange(rowNum, 1, ary.length, colNum).setValues(ary);
  if (sheet.getLastRow() >= 1000) {
    sheet.deleteRows(1000, sheet.getLastRow() - 999);//1000行以上なら1000行目以降を削除して999行に。
  }
}

//保護シートでも機能する関数（★事前に十分な行数を用意する前提。）
//ログにary行数分記入（★新しいのが下）
//シート、行列（★２次元）、列数（列数に変動があるとエラーになるため定義してほしい）
function addLogLast(sheet, ary, colNum) {
  sheet.getRange(sheet.getLastRow() + 1, 1, ary.length, colNum).setValues(ary);
}

//文字列の指定行数「より後ろ」をカットする（そんなに行数なければスルーして同じ文字列返す）
//st=文字列、row=行数、結果はrow行になる。
function stRowCut(st, row) {
  var output = "";
  var st_ary = st.split(/\r\n|\n/);
  if (st_ary.length >= row + 1) {
    st_ary.splice(row, st_ary.length - row);
    for (var r = 0; r <= st_ary.length - 1; r++) {
      output = output + st_ary[r] + "\n";
    }
  } else {
    output = st;
  }
  return output;
}

//スプシオブジェクト、シート名→gid（トリガーからGIDで振り分けるのに使う。シート名は変えられるため）
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
