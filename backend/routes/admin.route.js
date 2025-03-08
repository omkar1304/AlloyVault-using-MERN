import express from "express";
import authenticate from "../middleware/auth.middleware.js";
import { getRoles } from "../controllers/admin/role.controller.js";



const router = express.Router();

router.get("/getRoles", authenticate, getRoles);

export default router;