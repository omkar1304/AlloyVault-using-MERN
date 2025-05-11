import mongoose from "mongoose";

const CompanySchema = new mongoose.Schema(
  {
    name: { type: String, unique: true, required: true },
    desc: { type: String },
    grades: { type: String },
    imgURL: { type: String },
    branches: { type: [mongoose.Types.ObjectId], default: [] },
    address1: { type: String },
    address2: { type: String },
    pincode: { type: String },
    email: { type: String },
    mobile: { type: String },
    gstNo: { type: String },
    cinNo: { type: String },
    msme: { type: String },
    paymentDetails: {
      bankName: { type: String },
      branch: { type: String },
      ifsCode: { type: String },
      accountNumber: { type: String },
    },
    createdBy: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const Company = mongoose.model("company", CompanySchema);
export default Company;
