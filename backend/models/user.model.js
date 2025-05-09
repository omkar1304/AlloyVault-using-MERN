import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    displayName: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: mongoose.Types.ObjectId, ref: "Role" },
    branch: { type: mongoose.Types.ObjectId, ref: "Option" },
    isAdminApproved: { type: Boolean, default: false },
    otp: { type: String },
    otpExpires: { type: Date },
  },
  { timestamps: true }
);

const User = mongoose.model("user", UserSchema);
export default User;
