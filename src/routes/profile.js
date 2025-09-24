import express from "express";
import { authUser } from "../middlewares/auth.js";
import { editProfileValidator } from "../utils/validation.js";

const profileRouter = express.Router();

profileRouter.get("/profile", authUser, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(401).send("Error: " + error.message);
  }
});

profileRouter.patch("/profile/edit", authUser, async (req, res) => {
  try {
    if (!editProfileValidator(req.body)) {
      return res.status(400).send({ message: "Invalid updates!" });
    }

    const user = req.user;

    Object.keys(req.body).forEach((key) => {
      user[key] = req.body[key];
    });

    await user.save();
    res.status(200).send({ message: "Profile updated successfully!", user });
  } catch (error) {
    res.status(500).send("Error: " + error.message);
  }
});

export default profileRouter;
