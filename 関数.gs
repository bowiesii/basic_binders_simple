//文字列が空でないほうを返す（st2優先）
function stNotNull(st1, st2) {
  if (st2 == "") {
    return st1
  } else {
    return st2
  }
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

//スプシ、シート名→gid（トリガーからGIDで振り分けるのに使う。シート名は変えられるため）
function getGIDbysheetname(spreadSheet, sheetN) {

  for (let sheet of spreadSheet.getSheets()) {
    if (sheet.getSheetName() === sheetN) {
      return sheet.getSheetId();
    }
  }

  return null;
}

//idとgid→シートのurl
function toUrl(id, gid) {
  var output = "https://docs.google.com/spreadsheets/d/" + id + "/edit#gid=" + gid
  return output;
}

//url→シート
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