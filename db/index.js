const mongoose = require("mongoose");
const Message = require("./models/message");
const Chat = require("./models/chat");
const User = require("./models/user");

// SET UP Mongoose Promises.
mongoose.Promise = global.Promise;

const startDB = ({ url }) =>
  mongoose.connect(url, {
    useNewUrlParser: true
  });

const models = {
  Message,
  Chat,
  User
};

module.exports = { startDB, models };
