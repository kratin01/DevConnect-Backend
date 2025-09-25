import express from "express";
import { connectDB } from "./config/database.js";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.js";
import profileRouter from "./routes/profile.js";
import requestRouter from "./routes/request.js";
import userRouter from "./routes/user.js";
import cors from "cors";

const app = express();

// Add a root route for testing
app.get("/", (req, res) => {
  res.send("DevConnect Backend is running!");
});

app.use(
  cors({origin: "*", credentials: true})
);
app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

connectDB()
  .then(() => {
    console.log("Database Connected Successfully!!");
    app.listen(7777, () => {
      console.log("Server is running on port 7777");
    });
  })
  .catch((err) => {
    console.log("Error in database connection");
  });