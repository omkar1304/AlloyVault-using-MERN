import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: mongoose.Types.ObjectId, ref: "Role" },
  },
  { timestamps: true }
);

const User = mongoose.model("user", UserSchema);
export default User;
