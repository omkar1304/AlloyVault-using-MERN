import mongoose from "mongoose";

const CitySchema = mongoose.Schema(
  {
    name: { type: String},
    stateCode: { type: String, required: true },
    createdBy: { type: mongoose.Types.ObjectId, ref: "User" },
  },

  { timestamps: true }
);

const City = mongoose.model("City", CitySchema);
export default City;
