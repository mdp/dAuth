// Space out our string for easier entry
// 12345678 becomes "1234 5678"
// 123456 becomes "123 456"
// 1234567 becomes "1234 567"
exports.spaceStr = function(otp) {
  // Group by 3's if not a multiple of four
  if (otp.length % 3 === 0 && otp.length % 4 !== 0) {
    return otp.match(/.{1,3}/g).join(' ')
  // Default to groupings of 4's
  } else {
    return otp.match(/.{1,4}/g).join(' ')
  }
}

exports.zeroPad = function(num, places) {
  var zero = places - num.toString().length + 1;
  return Array(+(zero > 0 && zero)).join("0") + num;
}
