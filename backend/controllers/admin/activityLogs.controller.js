import ActivityLog from "../../models/activityLog.model.js";
import decryptUrlPayload from "../../lib/decryptUrlPayload.js";

export const getActivityLogs = async (req, res) => {
  try {
    const { payload } = req.query;
    const {
      page = 1,
      size = 25,
      keyword = undefined,
    } = decryptUrlPayload(payload);

    // Calculate the number of documents to skip
    const skip = (page - 1) * size;

    let matchQueryStage = [];
    if (keyword !== undefined) {
      const words = keyword.split(" ");
      const searchConditions = words.map((word) => ({
        $or: [
          { "user.name": { $regex: word, $options: "i" } },
          { action: { $regex: word, $options: "i" } },
        ],
      }));

      matchQueryStage.push({
        $and: searchConditions,
      });
    }

    const result = await ActivityLog.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
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
        $sort: { createdAt: -1 },
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
                displayName: { $arrayElemAt: ["$user.displayName", 0] },
                email: { $arrayElemAt: ["$user.email", 0] },
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
    const logs = result[0].paginatedResults;
    return res.status(200).json({ logs, total });
  } catch (error) {
    console.log("Error in get logs controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
