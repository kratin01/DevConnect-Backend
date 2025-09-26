import express from "express";
import { authUser } from "../middlewares/auth.js";
import User from "../models/user.js";
import ConnectionRequest from "../models/connectionRequest.js";
import { sendEmail } from "../utils/sendEmail.js";
import { getAcceptedRequestTemplate } from "../utils/emailTemplates.js";

const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:userID",
  authUser,
  async (req, res) => {
    try {
      const { status, userID } = req.params;

      const allowedStatus = ["interested", "ignored"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: "Status Not Allowed" });
      }
      const from_user = req.user;
      const to_user = await User.findById({
        _id: userID,
      });
      if (!to_user) {
        return res.status(404).json({ message: "User Not Found" });
      }

      const exisitingRequest = await ConnectionRequest.findOne({
        $or: [
          { toUserId: to_user._id, fromUserId: from_user._id },
          { toUserId: from_user._id, fromUserId: to_user._id },
        ],
      });
      if (exisitingRequest) {
        return res.status(400).json({ message: "Request Already Exists" });
      }
      const newRequest = new ConnectionRequest({
        toUserId: to_user._id,
        fromUserId: from_user._id,
        status,
      });
      await newRequest.save();

      res.status(201).json({
        message: `${from_user.firstName} is just ${
          status === "interested" ? "interested in" : "ignoring"
        } ${to_user.firstName}`,
      });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error", error });
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestID",
  authUser,
  async (req, res) => {
    try {
      const { status, requestID } = req.params;
      const loggedInUser = req.user;
      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: "Invalid Status" });
      }
      const request = await ConnectionRequest.findOne({
        _id: requestID,
        toUserId: loggedInUser._id,
        status: "interested",
      });
      if (!request) {
        return res.status(404).json({ message: "Request not found" });
      }

      request.status = status;
      const data = await request.save();

      try {
        if (status === "accepted") {
          const fromUser = await User.findById(request.fromUserId);

          const subject = "Your Connection Request Has Been Accepted! 🎉";
          const htmlBody = await getAcceptedRequestTemplate(
            fromUser,
            loggedInUser
          );
          const textBody = `Hi ${fromUser.firstName}, your connection request to ${loggedInUser.firstName} has been accepted. You can now connect and collaborate with them! Visit your profile at https://devconnect.services to see more.`;

          // Check if the template was loaded successfully
          if (htmlBody) {
            await sendEmail(subject, htmlBody, textBody, fromUser.email);
          }
        }
      } catch (error) {
        console.error("Error sending email:", error);
      }
      return res.status(200).json({
        message: `${loggedInUser.firstName} has ${
          status === "accepted" ? "accepted" : "rejected"
        } the connection request`,
        data,
      });
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error", error });
    }
  }
);

export default requestRouter;
