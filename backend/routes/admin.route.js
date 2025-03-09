import express from "express";
import authenticate from "../middleware/auth.middleware.js";
import { addRole, getRoles } from "../controllers/admin/role.controller.js";

const router = express.Router();

router.get("/getRoles", authenticate, getRoles);
router.post("/addRole", authenticate, addRole);

export default router;
