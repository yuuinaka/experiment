// console.logにcssを指定
console.log("%ctest", "background-color:#f00;color:#fff;padding:5px;font-size:20px");

// 実行時間を計測
console.time("test1");
for(var i=0;i<1000;i++){
  console.log("hoge");
}
console.timeEnd("test1");

// グルーピング
console.group("test1");
console.log("test1-1");
console.log("test1-2");
console.log("test1-3");
console.groupEnd("test1");

// 条件によって出力
console.assert(true, "falseだと表示");
console.assert(false, "falseだと表示");
