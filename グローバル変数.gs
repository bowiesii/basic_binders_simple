const gid_wtask1 = "1616634719";//週タスク１のGID
const gid_wtask2 = "2097376321";//週タスク２
const gid_wtask3 = "1024816661";//週タスク３

//本日日付定義
//const today = new Date("2023/7/2");
//やっぱり本当の日付
const today = new Date();
const todayYear = today.getFullYear();
const todayMonth = today.getMonth() + 1;
const todayDate = today.getDate();
const wary = ["日", "月", "火", "水", "木", "金", "土"];
const today_wjpn = wary[today.getDay()];
const today_ymd = Utilities.formatDate(today, 'JST', 'yyyy/MM/dd');
const today_ymdd = today_ymd + " " + today_wjpn;
const today_hm = Utilities.formatDate(today, 'JST', 'HH:mm');
const today_ymddhm = today_ymdd + " " + today_hm;

const userProps = PropertiesService.getUserProperties();




