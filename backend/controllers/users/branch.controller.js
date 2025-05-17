import mongoose from "mongoose";
import decryptUrlPayload from "../../lib/decryptUrlPayload.js";
import Branch from "../../models/branch.model.js";

export const getBranchAsOption = async (req, res) => {
  try {
    const { payload } = req.query;
    const { comapnyId = undefined, withCompanyLabel = false } =
      decryptUrlPayload(payload);

    const result = await Branch.aggregate([
      {
        $match: {
          isEnabled: true,
        },
      },
      // If company based branch option is required
      ...(comapnyId !== undefined
        ? [
            {
              $lookup: {
                from: "companies",
                localField: "_id",
                foreignField: "branches",
                as: "companyInfo",
                pipeline: [
                  {
                    $match: {
                      _id: new mongoose.Types.ObjectId(comapnyId),
                    },
                  },
                ],
              },
            },
            {
              $unwind: {
                path: "$companyInfo",
                preserveNullAndEmptyArrays: false,
              },
            },
          ]
        : []),
      {
        $sort: { name: 1 },
      },
      {
        $project: {
          _id: 0,
          label:
            // If company label required then concat with prefix of branch
            comapnyId && withCompanyLabel
              ? {
                  $concat: ["$companyInfo.name", " ", "(", "$prefix", ")"],
                }
              : // Else return name as it is
                "$name",
          value: "$_id",
        },
      },
    ]);
    return res.status(200).send(result);
  } catch (error) {
    console.log("Error in get branch as option controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
