const mongoose = require("mongoose");

const chatSchema = mongoose.Schema(
  {
    chatName: { type: String, trim: true },
    isGroupChat: { type: Boolean, default: false },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    lastSeenMessage: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        // message: { type: String, trim: true },
        message: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
        content: { type: String, trim: true },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    
  },
  { timestamps: true }
);

const Chat = mongoose.model("Chat", chatSchema);
module.exports = Chat;
