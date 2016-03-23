let settings = require('../config/Settings')

exports.debug = function() {
  if (settings.debug) {
    console.log.call(arguments)
  }
}

exports.info = function() {
  console.log.call(arguments)
}

exports.warn = function() {
  console.log.call(arguments)
}

exports.fatal = function() {
  console.log.call(arguments)
}
