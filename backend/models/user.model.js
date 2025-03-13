import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    displayName: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: mongoose.Types.ObjectId, ref: "Role" },
    isAdminApproved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const User = mongoose.model("user", UserSchema);
export default User;
