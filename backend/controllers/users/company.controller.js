import decryptUrlPayload from "../../lib/decryptUrlPayload.js";
import Company from "../../models/company.model.js";

export const getCompaniesAsOption = async (req, res) => {
  try {
    const { payload } = req.query;
    const { sameAsLabel = false } = decryptUrlPayload(payload);
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
