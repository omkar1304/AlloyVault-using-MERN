import mongoose from "mongoose";

const CountrySchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    countryCode: { type: String, required: true },
    createdBy: { type: mongoose.Types.ObjectId, ref: "User" },
  },

  { timestamps: true }
);

const Country = mongoose.model("country", CountrySchema);
export default Country;
