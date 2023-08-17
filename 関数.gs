//※シンプルトリガーは編集不可ライブラリは使えない

//ユーザーの記録日時からシフト日をシフト種別を決定
//早朝：６～９時５９分
//午前：１０～１３時５９分
//午後：１４～１７時５９分
//夕勤：１８～２２時５９分
//準夜：２３～翌５時５９分
//入力＝Date型
function shiftDN() {

  var shiftDay = today_ymdd;
  var shiftName = "";
  var hh = Utilities.formatDate(today, 'JST', 'HH');

  if (hh <= 5) {//準夜、日付マイナス１
    shiftName = "準夜";
    var today_1 = new Date(today);
    today_1.setDate(today_1.getDate() - 1);//昨日にする
    today_1_ymd = Utilities.formatDate(today_1, "JST", "yyyy/MM/dd");
    var today_1_wjpn = wary[today_1.getDay()];
    shiftDay = today_1_ymd + " " + today_1_wjpn;

  } else if (hh <= 9) {//早朝
    shiftName = "早朝";
  } else if (hh <= 13) {//午前
    shiftName = "午前";
  } else if (hh <= 17) {//午後
    shiftName = "午後";
  } else if (hh <= 22) {//夕勤
    shiftName = "夕勤";
  } else if (hh <= 23) {//準夜
    shiftName = "準夜";
  }

  shiftDay = shiftDay.toString();//文字列化

  return { shiftDay, shiftName };

}

//進捗度を数値化(タスク種別、進捗度)
//今のところ、週タスクの棚づくりのみ
function quantify(taskN, progN) {
  var num = 0;

  if (taskN == "【棚】") {
    if (progN == "印刷まで") {
      num = 0;
    } else if (progN == "〇×まで") {
      num = 1;
    } else if (progN == "棚作途中") {
      num = 2;
    } else if (progN == "済") {
      num = 3;
    }

  } else if (taskN == "価格変更") {
    if (progN == "〇×まで") {
      num = 1;
    } else if (progN == "入替途中") {
      num = 2;
    } else if (progN == "済") {
      num = 3;
    }

  } else if (taskN == "週タスクその他") {
    if (progN == "△") {
      num = 1;
    } else if (progN == "済") {
      num = 3;
    }

  } else if (taskN == "発注") {
    if (progN != undefined) {
      progN = progN.replace(/\s/g, "");//空白削除
    }
    if (progN == undefined || progN == "") {
      num = 0;
    } else {
      num = 3;
    }

  } else if (taskN == "新人") {
    if (progN == "△") {
      num = 2;
    } else if (progN == "〇" || progN == "◎") {
      num = 3;
    }

  }

  return num;
}

//シート内の特定列の★２行以下のなかに特定文字列があるか
//ある→シートの行数（２～）を返す。ない→-1、stringがnullor""→-1
function searchInCol(sheet, col, string) {
  if (string == null || string == undefined || string == "") {//inputが空だったら問答無用で-1
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

//保護シートでも機能する関数（★事前に十分な行数を用意する前提。→1001行以上になる場合スルー）
//ログにary行数分記入（★新しいのが下）
//シート、行列（★２次元）、列数（列数に変動があるとエラーになるため定義してほしい）
function addLogLast(sheet, ary, colNum) {
  var afterRow = sheet.getLastRow() + ary.length;
  if (afterRow >= 1001) {
    Logger.log("シートが1000行以上になるため記録不可");
    return;
  }
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


// 英数字を全角から半角に変換
function convertCharacters(original) {
  let converted = ""; // 空の変数
  const pattern = /[Ａ-Ｚａ-ｚ０-９]/; // 全角英数のパターンを用意
  for (let i = 0; i < original.length; i++) { // 受け取った文字列の数だけ繰り返し
    if (pattern.test(original[i])) { // 文字が全角英数のとき
      const half = String.fromCharCode(original[i].charCodeAt(0) - 65248); // 半角英数に変換
      converted += half;
    } else {
      converted += original[i];
    }
  }
  converted = converted.replace(/　/g, ' ').replace(/．/g, '.'); // gオプションで該当文字列をすべて置換
  // Logger.log(converted);
  return converted;
}
