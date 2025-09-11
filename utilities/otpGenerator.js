import pkg from 'otp-generator'

// OTP Options
const otpOptions = {
  digits: true,
  lowerCaseAlphabets: true,
  upperCaseAlphabets: true,
  specialChars: true,
}

/**
 * @constant generate
 * @description Generates a One-Time Password (OTP) based on the specified length and options.
 * @param {Number} length - Length of the OTP to be generated (default is 10)
 * @param {Object} options - Options to include/exclude character types
 * options - optional
 * -- digits - Default: true true value includes digits in OTP
 * -- lowerCaseAlphabets - Default: true true value includes lowercase alphabets in OTP
 * -- upperCaseAlphabets - Default: true true value includes uppercase alphabets in OTP
 * -- specialChars - Default: true true value includes special Characters in OTP
 * @returns {String} Generated OTP
 * @example otpGenerator.generate(length, {..options})
 */
function generateOTP() {
//   console.log('PKG: ', pkg)
  return pkg.generate(6, otpOptions)
}

export { generateOTP }
