const bcrypt = require("bcrypt");

const hashPassword = async password => {
  const hash = await bcrypt.hash(password, 10);
  return hash;
};

module.exports = { hashPassword };
