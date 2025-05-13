import mongoose from "mongoose";

const invoiceCounterSchema = mongoose.Schema(
  {
    branchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Option",
      required: true,
    },
    financialYear: { type: String, required: true },
    counter: { type: Number, default: 0 },
  },
  { timestamps: true }
);

invoiceCounterSchema.index({ branchId: 1, financialYear: 1 }, { unique: true });

const InvoiceCounter = mongoose.model("InvoiceCounter", invoiceCounterSchema);
export default InvoiceCounter;
