import mongoose from "mongoose";
import { Schema } from "mongoose";
const messageSchema = new Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const chatSchema = new Schema({
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],

  messages: [messageSchema],
});

const Chat = mongoose.model("Chat", chatSchema);
export default Chat;
