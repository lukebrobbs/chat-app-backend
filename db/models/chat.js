const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  users: {
    type: Array,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  createdOn: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Chat", ChatSchema);
