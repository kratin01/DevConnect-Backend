import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();


export const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://kratin:FCZO1QtdWSLGNWAp@devtinder.gzw23ee.mongodb.net/devTinder");
    // console.log("MongoDB connected successfully!");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err.message);
    process.exit(1);
  }
};

