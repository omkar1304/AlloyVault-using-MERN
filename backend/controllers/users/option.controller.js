import mongoose from "mongoose";
import decryptUrlPayload from "../../lib/decryptUrlPayload.js";
import Options from "./../../models/options.model.js";

export const getAsOption = async (req, res) => {
  try {
    const { payload } = req.query;
    const {
      type = undefined,
      sameAsLabel = false,
      comapnyId = undefined,
    } = decryptUrlPayload(payload);

    if (!type) {
      return res.status(400).json({ message: "Type is required" });
    }

    const result = await Options.aggregate([
      {
        $match: {
          type,
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
          label: "$name",
          value: sameAsLabel ? "$name" : "$_id",
        },
      },
    ]);

    return res.status(200).send(result);
  } catch (error) {
    console.log("Error in get options controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
