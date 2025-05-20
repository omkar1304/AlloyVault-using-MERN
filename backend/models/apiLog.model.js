import mongoose from "mongoose";

const apiLogSchema = new mongoose.Schema(
  {
    method: { type: String },
    url: { type: String },
    statusCode: { type: Number },
    requestBody: { type: mongoose.Schema.Types.Mixed },
    responseBody: { type: mongoose.Schema.Types.Mixed },
    errorMessage: { type: String },
    requestedBy: { type: mongoose.Types.ObjectId, ref: "User" },
    responseTime: { type: Number },
  },
  { timestamps: true }
);

const ApiLog = mongoose.model("apiLog", apiLogSchema);
export default ApiLog;
