import decryptUrlPayload from "../../lib/decryptUrlPayload.js";
import Options from "./../../models/options.model.js";

export const getOptions = async (req, res) => {
  try {
    const { payload } = req.query;
    const {
      page = 1,
      size = 25,
      type = undefined,
      keyword = undefined,
    } = decryptUrlPayload(payload);

    if (!type) {
      return res.status(400).json({ message: "Type is required" });
    }

    // Calculate the number of documents to skip
    const skip = (page - 1) * size;

    let matchQueryStage = [];
    if (keyword !== undefined) {
      const words = keyword.split(" ");
      const searchConditions = words.map((word) => ({
        $or: [{ name: { $regex: word, $options: "i" } }],
      }));

      matchQueryStage.push({
        $and: searchConditions,
      });
    }

    const result = await Options.aggregate([
      {
        $match: {
          type,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "createdBy",
          foreignField: "_id",
          as: "user",
          pipeline: [
            {
              $project: {
                displayName: 1,
                email: 1,
              },
            },
          ],
        },
      },
      // Keyword filter
      ...(matchQueryStage.length
        ? [{ $match: { $and: matchQueryStage } }]
        : []),
      {
        $sort: { name: 1 },
      },
      {
        $facet: {
          totalCount: [{ $count: "count" }],
          paginatedResults: [
            { $skip: skip },
            { $limit: size },
            {
              $project: {
                _id: 1,
                isEnabled: 1,
                type: 1,
                createdBy: { $arrayElemAt: ["$user.displayName", 0] },
                action: 1,
                createdAt: 1,
              },
            },
          ],
        },
      },
    ]);
    const total =
      result[0].totalCount.length > 0 ? result[0].totalCount[0].count : 0;
    const options = result[0].paginatedResults;
    return res.status(200).json({ options, total });
  } catch (error) {
    console.log("Error in get options controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateOptionField = async (req, res) => {
  try {
    const { optionId, fieldName, fieldValue } = decryptData(req.body.payload);

    if (!fieldName || !fieldValue || !optionId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const option = await Options.findByIdAndUpdate(optionId, {
      $set: {
        [fieldName]: fieldValue,
      },
    });

    if (!option) {
      return res.status(404).json({ message: "Option not found" });
    }

    return res.status(200).json({ message: "Option updated successfully" });
  } catch (error) {
    console.log("Error in update options controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
