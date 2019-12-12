const { makeStringTransform } = require('browserify-transform-tools')


module.exports = makeStringTransform('lavamoat-browserify-workarounds', { excludeExtension: ['.json'] }, (content, _, cb) => {
  const result = content
    // fix html comments
    .split('-->').join('-- >')
    // fix direct eval
    .split(' eval(').join(' (0, eval)(')
    .split('\neval(').join('\n(0, eval)(')

  cb(null, result)
})
