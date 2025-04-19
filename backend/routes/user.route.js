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
import {
  addBroker,
  deleteBroker,
  getBrokersAsOption,
  updateBroker,
} from "../controllers/users/broker.controller.js";
import {
  getCitiesAsOption,
  getCountriesAsOption,
  getStatesAsOption,
} from "../controllers/users/location.controller.js";
import {
  addPartyRecord,
  deletePartyRecord,
  getPartyDetails,
  getPartyRecords,
  getPartyRecordsAsOption,
  updatePartyRecord,
} from "../controllers/users/partyRecord.controller.js";
import { getAsOption } from "../controllers/users/option.controller.js";

const router = express.Router();

// Auth Routes ->
router.post("/register", register);
router.post("/login", login);
router.post("/sendOTP", sendOTP);
router.post("/verifyOTP", verifyOTP);
router.post("/resetPassword", resetPassword);
router.post("/logout", authenticate, logout);
router.get("/getAuthenticatedUser", authenticate, getAuthenticatedUser);

// Broker Routes ->
router.get("/getBrokersAsOption", authenticate, getBrokersAsOption);
router.post("/addBroker", authenticate, addBroker);
router.put("/updateBroker/:brokerId", authenticate, updateBroker);
router.delete("/deleteBroker/:brokerId", authenticate, deleteBroker);

// Location Routes ->
router.get("/getCountriesAsOption", authenticate, getCountriesAsOption);
router.get("/getStatesAsOption", authenticate, getStatesAsOption);
router.get("/getCitiesAsOption", authenticate, getCitiesAsOption);

// Party Record Routes ->
router.get("/getPartyRecords", authenticate, getPartyRecords);
router.get("/getPartyRecordsAsOption", authenticate, getPartyRecordsAsOption);
router.get("/getPartyDetails", authenticate, getPartyDetails);
router.post("/addPartyRecord", authenticate, addPartyRecord);
router.put("/updatePartyRecord/:recordId", authenticate, updatePartyRecord);
router.delete("/deletePartyRecord/:recordId", authenticate, deletePartyRecord);

// Options Routes ->
router.get("/getAsOption", authenticate, getAsOption);

export default router;
