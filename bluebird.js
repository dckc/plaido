// https://github.com/kumavis/browserify-example-global-replace/blob/master/bluebird.js 8c634b4
console.log('using the shim for bluebird!');

async function coroutine (createGenerator) {
  const generator = createGenerator();
  let next = generator.next();
  // for-of drops the return value
  // so we use a while loop
  while (!next.done) {
    // await next promise
    await next.value;
    // update next
    next = generator.next();
  }
  return next.value;
}

module.exports = {
  coroutine,
};

