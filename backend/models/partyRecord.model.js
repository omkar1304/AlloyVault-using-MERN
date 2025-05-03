import mongoose from "mongoose";

const PartyRecordSchema = new mongoose.Schema(
  {
    name: { type: String, unique: true, required: true },
    partyType: { type: mongoose.Types.ObjectId, ref: "Option" },
    broker: { type: mongoose.Types.ObjectId, ref: "Broker" },
    gstNo: { type: String, required: true },
    shippingAddress: { type: String },
    billingAddress: { type: String },
    country: { type: String },
    state: { type: String },
    city: { type: String },
    pincode: { type: String },
    email: { type: String },
    mobile: { type: String },
    createdBy: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const PartyRecord = mongoose.model("PartyRecord", PartyRecordSchema);
export default PartyRecord;
