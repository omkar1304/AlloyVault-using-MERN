import mongoose from "mongoose";

const OptionSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: Number, required: true }, // Types -> 1. Branch | 2. Material Type | 3. Material Class | 4. Grade
    isEnabled: { type: Boolean, required: true, default: true },
    createdBy: { type: mongoose.Types.ObjectId, ref: "User" },
  },

  { timestamps: true }
);

const Option = mongoose.model("option", OptionSchema);
export default Option;
