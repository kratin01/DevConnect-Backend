import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import isEmail from "validator/lib/isEmail.js";

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      required: true,
      unique: true,
      // validate: {
      //   validator: (value) => {
      //     return value.includes("iiitkota.ac.in");
      //   },
      //   message: "Your are not allowed",
      // },
      validate(value) {
        if (!isEmail(value)) {
          throw new Error("Please enter a valid email");
        }
      },
    },
    password: {
      type: String,
      required: true,
    },
    about: {
      type: String,
      maxLength: 250,
      default: "Hey there! I am using DevConnect.",
    },
    age: {
      type: Number,
      min: [18, "Age must be at least 18"],
    },
    gender: {
      type: String,
    },
    profileUrl: {
      type: String,
      default:
        "https://media.istockphoto.com/id/1130884625/vector/user-member-vector-icon-for-ui-user-interface-or-profile-face-avatar-app-in-circle-design.jpg?s=612x612&w=0&k=20&c=1ky-gNHiS2iyLsUPQkxAtPBWH1BZt0PKBB1WBtxQJRE=",
    },
  },
  { timestamps: true }
);

userSchema.methods.getJWT = function () {
  const user = this;
  const token = jwt.sign({ _id: user._id }, "Mainhibataunga@12", {
    expiresIn: "1d",
  });

  return token;
};

userSchema.methods.validatePassword = async function (userInputPassword) {
  const user = this;
  const hashedPasswrod = user.password;
  const isPasswordVaild = await bcrypt.compare(
    userInputPassword,
    hashedPasswrod
  );
  return isPasswordVaild;
};

export default mongoose.model("User", userSchema);
