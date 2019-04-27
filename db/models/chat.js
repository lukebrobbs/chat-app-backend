const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ChatSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  users: {
    type: [{ type: Schema.Types.ObjectId, ref: "User", required: true }]
  },
  admin: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdOn: {
    type: Date,
    default: Date.now
  },
  messages: {
    type: [{ type: Schema.Types.ObjectId, ref: "Message" }],
    default: []
  }
});

module.exports = mongoose.model("Chat", ChatSchema);
