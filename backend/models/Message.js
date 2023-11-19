const mongoose = require("mongoose");

/**
 * Represents a message schema.
 * @typedef {Object} MessageSchema
 * @property {mongoose.Schema.Types.ObjectId} sender - The ID of the sender user.
 * @property {string} content - The content of the message.
 * @property {mongoose.Schema.Types.ObjectId} chat - The ID of the chat the message belongs to.
 * @property {Array<mongoose.Schema.Types.ObjectId>} readBy - The IDs of the users who have read the message.
 * @property {Date} createdAt - The timestamp when the message was created.
 * @property {Date} updatedAt - The timestamp when the message was last updated.
 */
const messageSchema = mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: { type: String, trim: true },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

messageSchema.pre("remove", async function (next) {
  try {
    // Remove related Chat record
    await mongoose.model("Chat").updateOne(
      { _id: this.chat },
      { $pull: { messages: this._id } }
    );

    next();
  } catch (error) {
    next(error);
  }
});

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
