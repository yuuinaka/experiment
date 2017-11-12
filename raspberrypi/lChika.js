
const fs = require('fs');
const path = require('path');

const lChika = {};

lChika.light = (pin, len) => {

  console.log('lChika lighting...', pin, len);

  const dir = '/sys/class/gpio/';
  const gpio = path.join(dir, 'gpio' + pin);

  fs.writeFileSync(path.join(dir, 'export'), pin);

  fs.writeFileSync(path.join(gpio, 'direction'), 'out');

  fs.writeFileSync(path.join(gpio, 'value'), 1);

  setTimeout(function(){
    fs.writeFileSync(path.join(gpio, 'value'), 0);
    fs.writeFileSync(path.join(dir, 'unexport'), pin);
    console.log('lChika unexport');
  }, len);

};

module.exports = lChika;

