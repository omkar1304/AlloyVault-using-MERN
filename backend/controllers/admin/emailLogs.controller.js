import decryptUrlPayload from "../../lib/decryptUrlPayload.js";
import EmailLog from "./../../models/emailLog.model.js";

export const getEmailLogs = async (req, res) => {
  try {
    const { payload } = req.query;
    const decrypted = decryptUrlPayload(payload);
    req.decryptedBody = decrypted;
    const { page = 1, size = 25, keyword = undefined } = decrypted;

    // Calculate the number of documents to skip
    const skip = (page - 1) * size;

    let matchQueryStage = [];
    if (keyword !== undefined) {
      const words = keyword.split(" ");
      const searchConditions = words.map((word) => ({
        $or: [{ subject: { $regex: word, $options: "i" } }],
      }));

      matchQueryStage.push({
        $and: searchConditions,
      });
    }

    const result = await EmailLog.aggregate([
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
          paginatedResults: [{ $skip: skip }, { $limit: size }],
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
