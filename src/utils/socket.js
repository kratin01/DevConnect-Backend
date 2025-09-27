import { Server } from "socket.io";
import crypto from "crypto";
import Chat from "../models/chat.js";
import connectionRequest from "../models/connectionRequest.js";

const getSecretRoomId = (userId, targetUserId) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("$"))
    .digest("hex");
};

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });
  

  io.on("connection", (socket) => {
    // console.log("A user connected:", socket.id);

    socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
      //so what happen here is if user 1 joins the room and user 2 also joins the room with same room id then they can talk to each other beacause they are in same room
      const roomId = getSecretRoomId(userId, targetUserId);

      //socket join is very important because it allows us to join a specific room
      socket.join(roomId);
      console.log(firstName + " Joined room: ", roomId);
    });

    //now it's backend job to send this message to the target user if he is in the room
    socket.on(
      "sendMessage",
      async ({ firstName, lastName, userId, targetUserId, text }) => {
        try {
          //Checking weather they are friends or not
          const isTheyFrnd = await connectionRequest.findOne({
            $or: [
              {
                toUserId: targetUserId,
                fromUserId: userId,
                status: "accepted",
              },
              {
                toUserId: userId,
                fromUserId: targetUserId,
                status: "accepted",
              },
            ],
          });
          if (!isTheyFrnd) {
            return;
          }

          const roomId = getSecretRoomId(userId, targetUserId);
          //   console.log(firstName + " " + text);

          let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] },
          });

          if (!chat) {
            chat = new Chat({
              participants: [userId, targetUserId],
              messages: [],
            });
          }

          chat.messages.push({ senderId: userId, text });
          await chat.save();

          // Emit the message to the room

          io.to(roomId).emit("messageReceived", { firstName, lastName, text });
        } catch (error) {
          console.log("Error in sendMessage:", error);
        }
      }
    );

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  return io;
};

export default initializeSocket;
