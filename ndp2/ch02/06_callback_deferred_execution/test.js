const fs = require('fs');
const cache = {};

function consistentReadAsync(filename, callback) {
    if (cache[filename]) {
        process.nextTick(() => callback(cache[filename]));
    } else {
        fs.readFile(filename, 'utf8', (err, data) => {
            cache[filename] = data;
            callback(data);
        });
    }
}