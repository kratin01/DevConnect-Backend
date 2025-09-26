import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const authUser = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).send("Please login first");
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const { _id } = decode;
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found");
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("Error: "+ err.message);
  }
};
