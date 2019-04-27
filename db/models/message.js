const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new mongoose.Schema({
  chat: { type: Schema.Types.ObjectId, ref: "Chat", required: true },
  content: {
    type: String,
    required: true
  },
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdOn: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Message", MessageSchema);
