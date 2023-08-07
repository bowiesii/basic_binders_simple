//※シンプルトリガーは編集不可ライブラリは使えない

//シート内の特定列の★２行以下のなかに特定文字列があるか
//ある→シートの行数（２～）を返す。ない→-1、stringがnull→-1
function searchInCol(sheet, col, string) {
  if (string == null) {
    return -1;
  }
  var dataNum = sheet.getLastRow() - 1;
  if (dataNum >= 1) {//これしないとgetrangeでエラー
    var ary = sheet.getRange(2, col, dataNum, 1).getValues();//二次元配列になってる
    for (let r = 0; r <= ary.length - 1; r++) {
      if (ary[r][0] == string) {
        return r + 2;
      }
    }
    return -1;
  } else {
    return -1;
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
    if (sheet.getSheetName() == sheetName) {
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
