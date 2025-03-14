import express from "express";
import {
  getAuthenticatedUser,
  login,
  logout,
  register,
  resetPassword,
  sendOTP,
  verifyOTP,
} from "../controllers/users/auth.controller.js";
import authenticate from "../middleware/auth.middleware.js";

const router = express.Router();

//? Auth Routes ->
router.post("/register", register);
router.post("/login", login);
router.post("/sendOTP", sendOTP);
router.post("/verifyOTP", verifyOTP);
router.post("/resetPassword", resetPassword);
router.post("/logout", authenticate, logout);
router.get("/getAuthenticatedUser", authenticate, getAuthenticatedUser);

export default router;
