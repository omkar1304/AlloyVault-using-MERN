import mongoose from "mongoose";

const ActivityLogSchema = mongoose.Schema(
  {
    userId: { type: mongoose.Types.ObjectId, ref: "User" },
    action: { type: String, required: true },
  },

  { timestamps: true }
);

const ActivityLog = mongoose.model("ActivityLog", ActivityLogSchema);
export default ActivityLog;
