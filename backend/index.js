import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";

import connectDB from "./lib/connectDB.js";
import userRouter from "./routes/user.route.js";

dotenv.config();
const PORT = process.env.PORT;
const app = express();
bodyParser.json();

//* Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

//* Routes
app.use("/api/users", userRouter);

//* Listeting
app.listen(PORT, () => {
  console.log(`💻 Server running on port ${PORT}`);
  connectDB();
});
