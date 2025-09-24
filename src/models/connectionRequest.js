import mongoose from "mongoose";
import { Schema } from "mongoose";

const connectionRequestSchema = new Schema(
  {
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: ["ignored", "interested", "accepted", "rejected"],
        message: `{VALUE} is incorrect for status type`,
      },
    },
  },
  { timestamps: true }
);
export default mongoose.model("ConnectionRequest", connectionRequestSchema);
