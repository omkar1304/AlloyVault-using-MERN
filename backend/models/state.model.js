import mongoose from "mongoose";

const StateSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    countryCode: { type: String, required: true },
    stateCode: { type: String, required: true },
    createdBy: { type: mongoose.Types.ObjectId, ref: "User" },
  },

  { timestamps: true }
);

const State = mongoose.model("State", StateSchema);
export default State;
