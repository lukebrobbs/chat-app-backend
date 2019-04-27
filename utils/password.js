const bcrypt = require("bcrypt");

const hashPassword = async password => {
  const hash = await bcrypt.hash(password, 10);
  return hash;
};

const comparePassword = async (password, hash) => {
  const match = await bcrypt.compare(password, hash);
  return match;
};

module.exports = { hashPassword, comparePassword };
