import mongoose from "mongoose";

const TransportSchema = new mongoose.Schema(
  {
    name: { type: String, unique: true, required: true },
    transportId: { type: String },
    mobile: { type: String },
    createdBy: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const Transport = mongoose.model("transport", TransportSchema);
export default Transport;
