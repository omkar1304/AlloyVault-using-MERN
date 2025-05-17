import mongoose from "mongoose";
import InvoiceCounter from "../models/invoiceCounter.model.js";
import getCurrentFinancialYear from "./getCurrentFinancialYear.js";

const updateInvoiceCounter = async (branchId) => {
  const financialYear = getCurrentFinancialYear();
  const counterDoc = await InvoiceCounter.findOneAndUpdate(
    {
      branchId: new mongoose.Types.ObjectId(branchId),
      financialYear,
    },
    {
      $inc: { counter: 1 },
    }
  );

  if (!counterDoc) {
    throw new Error("Given counter not found for branch");
  }
};

export default updateInvoiceCounter;
