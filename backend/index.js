import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";

import connectDB from "./lib/connectDB.js";
import userRouter from "./routes/user.route.js";
import adminRouter from "./routes/admin.route.js";

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
    origin: [process.env.FRONTEND_URL],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

//* To serve static files
app.use("/uploads/companyImages", express.static("./uploads/companyImages"));
app.use("/uploads/invoices", express.static("./uploads/invoices"));

//* Routes
app.use("/api/users", userRouter);
app.use("/api/admin", adminRouter);

//* Listeting
app.listen(PORT, () => {
  console.log(`💻 Server running on port ${PORT}`);
  connectDB();
});
