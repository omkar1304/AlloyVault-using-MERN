import express from "express";
import authenticate from "../middleware/auth.middleware.js";
import {
  addRole,
  deleteRole,
  getRoles,
  updatePermission,
} from "../controllers/admin/role.controller.js";
import {
  getUserDetails,
  getUsers,
} from "../controllers/admin/user.controller.js";
import { getActivityLogs } from "../controllers/admin/activityLogs.controller.js";
import { getEmailLogs } from "../controllers/admin/emailLogs.controller.js";
import {
  addOption,
  deleteOption,
  getOptions,
  updateOptionField,
} from "../controllers/admin/option.controller.js";

const router = express.Router();

// User routes
router.get("/getUsers", authenticate, getUsers);
router.get("/getUserDetails/:userId", authenticate, getUserDetails);

// Role routes
router.get("/getRoles", authenticate, getRoles);
router.post("/addRole", authenticate, addRole);
router.post("/updatePermission", authenticate, updatePermission);
router.delete("/deleteRole/:roleId", authenticate, deleteRole);

// Options routes
router.get("/getOptions", authenticate, getOptions);
router.post("/addOption", authenticate, addOption);
router.put("/updateOptionField", authenticate, updateOptionField);
router.delete("/deleteOption/:optionId", authenticate, deleteOption);

// Activity logs routes
router.get("/getActivityLogs", authenticate, getActivityLogs);

// Email logs routes
router.get("/getEmailLogs", authenticate, getEmailLogs);

export default router;
