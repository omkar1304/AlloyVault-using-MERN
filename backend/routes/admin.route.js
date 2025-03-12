import express from "express";
import authenticate from "../middleware/auth.middleware.js";
import {
  addRole,
  deleteRole,
  getRoles,
  updatePermission,
} from "../controllers/admin/role.controller.js";

const router = express.Router();

router.get("/getRoles", authenticate, getRoles);
router.post("/addRole", authenticate, addRole);
router.post("/updatePermission", authenticate, updatePermission);
router.delete("/deleteRole/:roleId", authenticate, deleteRole);

export default router;
