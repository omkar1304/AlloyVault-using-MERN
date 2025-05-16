import mongoose from "mongoose";

const ChallanRecordSchema = mongoose.Schema(
  {
    entryDate: { type: Date, required: true },
    challanNo: { type: String },
    challanFile: { type: String },
    branch: { type: mongoose.Types.ObjectId, ref: "Branch" },
    party: { type: mongoose.Types.ObjectId, ref: "PartyRecord" },
    typeEntry: { type: String }, // Outward, BT
    outwardType: { type: mongoose.Types.ObjectId, ref: "Option" },
    btType: { type: mongoose.Types.ObjectId, ref: "Option" },
    totalWeight: { type: Number },
    createdBy: { type: mongoose.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const ChallanRecord = mongoose.model("ChallanRecord", ChallanRecordSchema);
export default ChallanRecord;
