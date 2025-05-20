import decryptUrlPayload from "../../lib/decryptUrlPayload.js";
import Company from "../../models/company.model.js";

export const getCompaniesAsOption = async (req, res) => {
  try {
    const { payload } = req.query;
    const decrypted = decryptUrlPayload(payload);
    req.decryptedBody = decrypted;
    const { sameAsLabel = false } = decrypted;
    const result = await Company.aggregate([
      {
        $sort: { name: 1 },
      },
      {
        $project: {
          _id: 0,
          label: "$name",
          value: sameAsLabel ? "$name" : "$_id",
        },
      },
    ]);
    return res.status(200).send(result);
  } catch (error) {
    console.log("Error in get company options controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getCompanyDetails = async (req, res) => {
  try {
    const { payload } = req.query;
    const decrypted = decryptUrlPayload(payload);
    req.decryptedBody = decrypted;
    const { recordId = undefined } = decrypted;

    if (!recordId) {
      return res.status(400).json({ message: "Company ID is missing" });
    }

    const companyRecord = await Company.findById(recordId);

    if (!companyRecord) {
      return res.status(404).json({ message: "Company not found" });
    }

    return res.status(200).send(companyRecord);
  } catch (error) {
    console.log("Error in company record controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
