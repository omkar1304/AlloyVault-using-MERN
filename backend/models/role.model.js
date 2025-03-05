import mongoose from "mongoose";
import perms from "./permissions/root.js";

const RoleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    perms: { type: Array, default: perms },
    createdBy: { type: mongoose.Types.ObjectId },
  },
  { timestamps: true }
);

const Role = mongoose.model("role", RoleSchema);
export default Role;
