function addSync(a, b, callback) {
    setTimeout(() => callback(a + b), 100);
}
console.log('before');
addSync(2, 3, result => console.log('Result: ' + result));
console.log('after');