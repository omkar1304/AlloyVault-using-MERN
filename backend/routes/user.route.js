import express from "express";
import {
  getAuthenticatedUser,
  login,
  register,
} from "../controllers/users/auth.controller.js";
import authenticate from "../middleware/auth.middleware.js";

const router = express.Router();

//? Auth Routes ->
router.post("/register", register);
router.post("/login", login);
router.get("/getAuthenticatedUser", authenticate, getAuthenticatedUser);

export default router;
