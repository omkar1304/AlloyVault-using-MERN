import mongoose from "mongoose";

const EmailLogSchema = mongoose.Schema(
  {
    subject: { type: String, required: true },
    status: {
      type: Number, // 0 -> Failed, 1 -> Success
    },
    sender: {
      type: String,
      required: true,
    },
    recipientTO: { type: String },
    recipientCC: { type: String },
    errorMessage: { type: String },
  },
  {
    timestamps: true,
  }
);

const EmailLog = mongoose.model("EmailLog", EmailLogSchema);
export default EmailLog;
