import mongoose from "mongoose";

const StockEntrySchema = mongoose.Schema(
  {
    type: { type: String }, // Types : 1. Inward | 2. Outward
    entryDate: { type: Date, required: true },
    invoiceNo: { type: String },
    branch: { type: mongoose.Types.ObjectId, ref: "Option" },
    inwardType: { type: mongoose.Types.ObjectId, ref: "Option" },
    company: { type: mongoose.Types.ObjectId, ref: "PartyRecord" },
    broker: { type: mongoose.Types.ObjectId, ref: "Broker" },
    transportName: { type: String },
    vehicleNo: { type: String },
    createdBy: { type: mongoose.Types.ObjectId, ref: "User" },

    // item ->
    materialType: { type: mongoose.Types.ObjectId, ref: "Option" },
    HSNCode: { type: String },
    grade: { type: mongoose.Types.ObjectId, ref: "Option" },
    size: { type: Number },
    shape: { type: mongoose.Types.ObjectId, ref: "Option" },
    weight: { type: Number },
    rate: { type: String },
    rackNo: { type: String },
    description: { type: String },
  },

  { timestamps: true }
);

const StockEntry = mongoose.model("StockEntry", StockEntrySchema);
export default StockEntry;
