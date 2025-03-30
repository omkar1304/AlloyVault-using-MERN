import mongoose from "mongoose";

const BrokerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    panNo: { type: String },
    mobile: { type: String },
    address: { type: String },
    createdBy: { type: mongoose.Types.ObjectId },
  },
  { timestamps: true }
);

const Broker = mongoose.model("broker", BrokerSchema);
export default Broker;
