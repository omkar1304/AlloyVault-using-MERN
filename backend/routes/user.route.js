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
import {
  addStockEntry,
  deleteStockEntry,
  getDetailsForPreview,
  getStockEntries,
  getStockEntryDetails,
  updateStockEntry,
} from "../controllers/users/stockEntry.controller.js";
import {
  getCompaniesAsOption,
  getCompanyDetails,
} from "../controllers/users/company.controller.js";
import { getInvoiceNumber } from "../controllers/users/invoiceCounter.controller.js";
import { getBranchAsOption } from "../controllers/users/branch.controller.js";

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

// Branch Routes ->
router.get("/getBranchAsOption", authenticate, getBranchAsOption);

// Stock Entry Routes ->
router.get("/getStockEntries", authenticate, getStockEntries);
router.post("/addStockEntry", authenticate, addStockEntry);
router.get("/getStockEntryDetails", authenticate, getStockEntryDetails);
router.get("/getDetailsForPreview", authenticate, getDetailsForPreview);
router.put("/updateStockEntry/:recordId", authenticate, updateStockEntry);
router.delete("/deleteStockEntry/:recordId", authenticate, deleteStockEntry);

// Company Routes
router.get("/getCompaniesAsOption", authenticate, getCompaniesAsOption);
router.get("/getCompanyDetails", authenticate, getCompanyDetails);

// Invoice Counter Routes
router.get("/getInvoiceNumber", authenticate, getInvoiceNumber)

export default router;
