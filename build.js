const { makeStringTransform } = require('browserify-transform-tools')
const fs = require('fs')
const browserify = require('browserify')

// configure LavaMoat
const lavamoatOpts = {
  config: './lavamoat-config.json'
}

// enable config autogen if specified
if (process.env.AUTOCONFIG) {
  lavamoatOpts.writeAutoConfig = true
}

// configure browserify
const bundler = browserify(['./index.js'], {
  plugin: [
    ['lavamoat-browserify', lavamoatOpts]
  ]
})

// remove html comments that SES is alergic to
const removeHtmlComment = makeStringTransform('remove-html-comment', { excludeExtension: ['.json'] }, (content, _, cb) => {
  const hideComments = content.split('-->').join('-- >')
  // bluebird uses eval, sorta
  const hideEval = hideComments.split(' eval(').join(' (eval)(')
  cb(null, hideEval)
})
bundler.transform(removeHtmlComment, { global: true })

// bundle and write to disk
bundler.bundle()
  .pipe(fs.createWriteStream('./bundle.js'))
