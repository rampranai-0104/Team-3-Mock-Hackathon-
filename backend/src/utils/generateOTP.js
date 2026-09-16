const crypto = require('crypto');

/**
 * Generate a cryptographically secure numeric OTP
 * @param {number} length - Number of digits (default: 6)
 * @returns {string} - String representation of the OTP (e.g. '482910')
 */
const generateOTP = (length = 6) => {
  if (typeof length !== 'number' || length < 4 || length > 10) {
    length = 6;
  }

  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;

  const otpNumber = crypto.randomInt(min, max + 1);
  return otpNumber.toString();
};

/**
 * Calculate expiration timestamp for an OTP
 * @param {number} minutes - Expiration window in minutes (default: 10)
 * @returns {Date}
 */
const getOTPExpiry = (minutes = 10) => {
  const windowMinutes = typeof minutes === 'number' && minutes > 0 ? minutes : 10;
  return new Date(Date.now() + windowMinutes * 60 * 1000);
};

module.exports = {
  generateOTP,
  generateNumericOTP: generateOTP,
  getOTPExpiry
};
