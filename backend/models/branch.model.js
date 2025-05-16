import mongoose from "mongoose";

const BranchSchema = new mongoose.Schema(
  {
    name: { type: String, unique: true, required: true },
    prefix: { type: String },
    address1: { type: String },
    address2: { type: String },
    address3: { type: String },
    isEnabled: { type: Boolean, required: true, default: true },
    createdBy: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const Branch = mongoose.model("branch", BranchSchema);
export default Branch;
