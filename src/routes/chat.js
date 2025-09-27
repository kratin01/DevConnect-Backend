import express from "express";
import { authUser } from "../middlewares/auth.js";
import Chat from "../models/chat.js";
import User from "../models/user.js";

const chatRouter = express.Router();

chatRouter.get("/chat/:targetUserId", authUser, async (req, res) => {
  const { targetUserId } = req.params;
  const userId = req.user._id;
  try {
    let chats = await Chat.findOne({
      participants: { $all: [userId, targetUserId] },
    }).populate({
      path: "messages.senderId",
      select: "firstName lastName",
    });
    const targetUser = await User.findById(targetUserId).select(
      "firstName lastName"
    );
    if (!chats) {
      chats = new Chat({
        participants: [userId, targetUserId],
        messages: [],
      });

      await chats.save();
    }
    res.status(200).json(chats);
  } catch (err) {
    console.log("Error while fetching the chat ", err);
  }
});

export default chatRouter;
