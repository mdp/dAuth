let settings = require('../config/Settings')

exports.debug = function() {
  if (settings.debug) {
    console.log.apply(this, arguments)
  }
}

exports.info = function() {
  console.log.apply(this, arguments)
}

exports.warn = function() {
  console.log.apply(this, arguments)
}

exports.fatal = function() {
  console.log.apply(this, arguments)
}
