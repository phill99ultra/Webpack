async function start() {
    return await Promise.resolve('async is working');
}
start().then(console.log);
// test for eslint
// const unused = 42;
class Util {
    static id = Date.now();
}
console.log('Util ID:', Util.id);

import('lodash').then(_ => {
    console.log('Lodash', _.random(0, 42, true));
});