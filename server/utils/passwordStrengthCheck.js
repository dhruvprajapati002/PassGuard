const zxcvbn = require('zxcvbn');

function isPasswordStrong(password) {
  const result = zxcvbn(password);

  return {
    score: result.score, // 0 to 4
    feedback: result.feedback,
    crackTime: result.crack_times_display.offline_fast_hashing_1e10_per_second,
    isStrong: result.score >= 3, // 3 or 4 is considered strong
  };
}

module.exports = isPasswordStrong;
