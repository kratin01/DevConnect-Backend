import express from "express";
import { authUser } from "../middlewares/auth.js";
const userRouter = express.Router();
import ConnectionRequest from "../models/connectionRequest.js";
import User from "../models/user.js";

userRouter.get("/user/requests/received", authUser, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const requests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", "firstName lastName age gender profileUrl about");
    res
      .status(200)
      .json({ message: "Requests fetched sucessfully!", requests });
  } catch (error) {
    res.status(400).send("Error: " + error);
  }
});

userRouter.get("/user/connections", authUser, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const requests = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        {
          fromUserId: loggedInUser._id,
          status: "accepted",
        },
      ],
    })
      .populate("fromUserId", "firstName lastName age gender profileUrl about ")
      .populate("toUserId", "firstName lastName age gender profileUrl about ");

    const data = requests.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res
      .status(200)
      .json({ message: "All connections fetched successfully", data: data });
  } catch (error) {
    res.status(400).send("Error: " + error);
  }
});

userRouter.get("/feed", authUser, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const limit = req.query.limit || 10;
    const page = req.query.page || 1;
    const skip = (page - 1) * limit;
    const connectionRequests = await ConnectionRequest.find({
      $or: [{ toUserId: loggedInUser._id }, { fromUserId: loggedInUser._id }],
    }).select("toUserId fromUserId");
    const hideReq = new Set();
    connectionRequests.forEach((req) => {
      hideReq.add(req.toUserId.toString());
      hideReq.add(req.fromUserId.toString());
    });
    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideReq) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select("firstName lastName profileUrl about age gender")
      .skip(skip)
      .limit(limit);
    res.send(users);
  } catch (error) {
    res.status(400).send("Error: " + error);
  }
});

export default userRouter;
