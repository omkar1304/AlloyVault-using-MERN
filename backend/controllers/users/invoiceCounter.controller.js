import decryptUrlPayload from "../../lib/decryptUrlPayload.js";
import Option from "../../models/options.model.js";
import getCurrentFinancialYear from "../../helpers/getCurrentFinancialYear.js";
import InvoiceCounter from "../../models/invoiceCounter.model.js";

export const getInvoiceNumber = async (req, res) => {
  try {
    const { payload } = req.query;
    const { branchId } = decryptUrlPayload(payload);

    const branch = await Option.findById(branchId);
    if (!branch) return res.status(404).json({ message: "Branch not found" });

    const financialYear = getCurrentFinancialYear();

    let counterDoc = await InvoiceCounter.findOne({
      branchId,
      financialYear,
    });

    if (!counterDoc) {
      counterDoc = await InvoiceCounter({ branchId, financialYear }).save();
    }

    const invoiceNumber = `${
      branch?.prefix
    }/${financialYear}/${counterDoc?.counter?.toString().padStart(4, "0")}`;

    return res.status(200).send({invoiceNumber});
  } catch (error) {
    console.log("Error in get invoice number controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
