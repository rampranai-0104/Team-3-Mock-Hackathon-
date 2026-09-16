const bcrypt = require('bcryptjs');

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

const comparePassword = async (password, hash) => {
  if (!password || !hash) return false;
  return await bcrypt.compare(password, hash);
};

module.exports = {
  hashPassword,
  comparePassword
};
