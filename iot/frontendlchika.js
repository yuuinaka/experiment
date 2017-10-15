
const fs = require('fs');
const path = require('path');

const dir = '/sys/class/gpio/';
const pin = 27;

fs.writeFileSync(path.join(dir, 'export'), pin);

const gpio27 = path.join(dir, 'gpio' + pin);

// todo
const result = Math.floor(Math.random() * 2);
console.log(result);

var count; 
var msec;
// ビルド成功なら1回点灯
if (result === 0) {
  count = 1;
  msec = 3000;
// ビルド失敗なら3回点滅
} else if (result === 1) {
  count = 3;
  msec = 1000;
}

fs.writeFileSync(path.join(gpio27, 'direction'), 'out');
//fs.writeFileSync(path.join(gpio27, 'value'), 1);

var i = 0;
const lChika = () => {

  i++;

  console.log(i % 2, count, msec);
  fs.writeFileSync(path.join(gpio27, 'value'), i % 2);

  if (i <= count * 2) {
    setTimeout(lChika, msec);
  } else {
    fs.writeFileSync(dir + 'unexport', pin);
    console.log('unexport');
  }

}

lChika();

