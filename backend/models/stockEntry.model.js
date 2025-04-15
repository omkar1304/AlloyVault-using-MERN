import mongoose from "mongoose";

const StockEntrySchema = mongoose.Schema(
  {
    type: { type: String }, // Types : 1. Inward | 2. Outward
    entryDate: { type: Date, required: true },
    invoiceNo: { type: String },
    branch: { type: String },
    materialType: { type: String },
    company: { type: String },
    broker: { type: String },
    transportName: { type: String },
    vehicleNo: { type: String },
    createdBy: { type: mongoose.Types.ObjectId, ref: "User" },

    // item ->
    materialClass: { type: String },
    HSNCode: { type: String },
    grade: { type: String },
    size: { type: Number },
    shape: { type: String },
    weight: { type: Number },
    rate: { type: String },
    rackNo: { type: String },
    description: { type: String },
  },

  { timestamps: true }
);

const StockEntry = mongoose.model("StockEntry", StockEntrySchema);
export default StockEntry;
