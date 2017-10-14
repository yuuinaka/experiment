const fs = require('fs');
const path = require('path');

const dir = '/sys/class/gpio/';
const pin = 27;

fs.writeFileSync(path.join(dir, 'export'), pin);

const gpio27 = path.join(dir, 'gpio' + pin);

fs.writeFileSync(path.join(gpio27, 'direction'), 'out');
fs.writeFileSync(path.join(gpio27, 'value'), 1);

setTimeout(() => {
  fs.writeFileSync(path.join(gpio27, 'value'), 0);
  fs.writeFileSync(path.join(dir, 'unexport'), pin);
}, 3000);

