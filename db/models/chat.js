const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ChatSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  users: {
    type: [{ type: Schema.Types.ObjectId, ref: "User" }]
  },
  author: {
    type: { type: Schema.Types.ObjectId, ref: "User" }
  },
  createdOn: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Chat", ChatSchema);
