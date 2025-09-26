import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/user.js";
import { signupValidator } from "../utils/validation.js";

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    signupValidator(req);
    const { firstName, lastName, email, password } = req.body;
    const isAlreadyExist = await User.findOne({ email: email });

    if (isAlreadyExist) {
      return res.status(403).send("User already exist!");
    }

    const hashedPasswrod = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPasswrod,
    });
    const savedUser = await user.save();
    const token = savedUser.getJWT();
    res.cookie("token", token, { expires: new Date(Date.now() + 8 * 3600000) }); // 8 hours

    return res.status(200).json({ message: "User created successfully", savedUser });

  } catch (error) {
    return res.status(401).send("Error: " + error.message);
  }
});

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(404).send("Invaild Credentials!");
    }

    const isValid = await user.validatePassword(password);

    if (!isValid) {
      return res.status(404).send("Invaild Credentials!");
    }

    const token = user.getJWT();
    res.cookie("token", token, { expires: new Date(Date.now() + 8 * 3600000) }); // 8 hours

    return res.status(200).json({ message: "User Login Successfully", user });

  } catch (error) {
    return res.status(401).send("Error: " + error.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).send("User logged out successfully!");
  } catch (error) {
    return res.status(401).send("Error: " + error.message);
  }
});

export default authRouter;