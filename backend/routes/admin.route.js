import express from "express";
import authenticate from "../middleware/auth.middleware.js";
import {
  addRole,
  deleteRole,
  getRoles,
  getRolesAsOption,
  updatePermission,
  updateRoleField,
} from "../controllers/admin/role.controller.js";
import {
  getUserDetails,
  getUsers,
  updateUser,
} from "../controllers/admin/user.controller.js";
import { getActivityLogs } from "../controllers/admin/activityLogs.controller.js";
import { getEmailLogs } from "../controllers/admin/emailLogs.controller.js";
import {
  addOption,
  deleteOption,
  getOptions,
  updateOptionField,
} from "../controllers/admin/option.controller.js";
import {
  addCompany,
  deleteCompany,
  getCompanies,
  getCompanyDetails,
  updateCompany,
} from "../controllers/admin/company.controller.js";
import uploadCompanyImg from "../middleware/uploadCompanyImg.middleware.js";

const router = express.Router();

// User routes
router.get("/getUsers", authenticate, getUsers);
router.get("/getUserDetails/:userId", authenticate, getUserDetails);
router.put("/updateUser/:recordId", authenticate, updateUser);

// Role routes
router.get("/getRoles", authenticate, getRoles);
router.get("/getRolesAsOption", authenticate, getRolesAsOption);
router.post("/addRole", authenticate, addRole);
router.post("/updatePermission", authenticate, updatePermission);
router.put("/updateRoleField", authenticate, updateRoleField);
router.delete("/deleteRole/:roleId", authenticate, deleteRole);

// Company routes
router.get("/getCompanies", authenticate, getCompanies);
router.get("/getCompanyDetails", authenticate, getCompanyDetails);
router.post(
  "/addCompany",
  authenticate,
  uploadCompanyImg.single("imgURL"),
  addCompany
);
router.put(
  "/updateCompany/:recordId",
  authenticate,
  uploadCompanyImg.single("imgURL"),
  updateCompany
);
router.delete("/deleteCompany/:recordId", authenticate, deleteCompany);

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
