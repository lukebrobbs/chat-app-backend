const mongoose = require("mongoose");
const Message = require("./message");

// SET UP Mongoose Promises.
mongoose.Promise = global.Promise;

const startDB = ({ user, pwd, url, db }) =>
  mongoose.connect(`mongodb+srv://${user}:${pwd}@${url}/${db}`, {
    useNewUrlParser: true
  });

const models = {
  Message
};

module.exports = { startDB, models };
