import createActivityLog from "../../helpers/createActivityLog.js";
import decryptData from "../../lib/decryptData.js";
import decryptUrlPayload from "../../lib/decryptUrlPayload.js";
import Transport from "../../models/transport.model.js";

export const getTransports = async (req, res) => {
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

    // Search filter
    if (keyword !== undefined) {
      const words = keyword.split(" ");
      const searchConditions = words.map((word) => ({
        $or: [{ name: { $regex: word, $options: "i" } }],
      }));

      matchQueryStage.push({
        $and: searchConditions,
      });
    }

    const result = await Transport.aggregate([
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
              $lookup: {
                from: "users",
                localField: "createdBy",
                foreignField: "_id",
                as: "createdByInfo",
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
            {
              $project: {
                _id: 1,
                name: 1,
                transportId: 1,
                mobile: 1,
                createdBy: {
                  $arrayElemAt: ["$createdByInfo.displayName", 0],
                },
                createdAt: 1,
              },
            },
          ],
        },
      },
    ]);
    const total =
      result[0].totalCount.length > 0 ? result[0].totalCount[0].count : 0;
    const transports = result[0].paginatedResults;
    return res.status(200).json({ transports, total });
  } catch (error) {
    console.log("Error in get transport controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getTransportAsOption = async (req, res) => {
  try {
    const result = await Transport.aggregate([
      {
        $sort: { name: 1 },
      },
      {
        $project: {
          _id: 0,
          label: "$name",
          value: "$_id",
        },
      },
    ]);
    return res.status(200).send(result);
  } catch (error) {
    console.log("Error in get transport as option controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getTransportDetails = async (req, res) => {
  try {
    const { payload } = req.query;
    const { recordId = undefined } = decryptUrlPayload(payload);

    if (!recordId) {
      return res.status(400).json({ message: "Transport ID is missing" });
    }

    const transport = await Transport.findById(recordId);

    if (!transport) {
      return res.status(404).json({ message: "Transport not found" });
    }

    return res.status(200).send(transport);
  } catch (error) {
    console.log("Error in transport details controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const addTransport = async (req, res) => {
  try {
    const payload = decryptData(req.body.payload);
    const { userId } = req?.user;

    const newTransport = await Transport({
      ...payload,
      createdBy: userId,
    }).save();

    if (!newTransport) {
      return res.status(500).json({ message: "Internal Server Error" });
    }

    await createActivityLog(
      userId,
      `User added Transport - ${newTransport?.name}`
    );

    return res.status(200).json({ message: "Transport added successfully" });
  } catch (error) {
    console.log("Error in add transport controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateTransport = async (req, res) => {
  try {
    const { recordId = undefined } = req.params;
    const payload = decryptData(req.body.payload);
    const { userId } = req?.user;

    if (!recordId) {
      return res.status(400).json({ message: "Transport ID is missing" });
    }

    const transport = await Transport.findByIdAndUpdate(recordId, {
      $set: {
        ...payload,
      },
    });

    if (!transport) {
      return res.status(404).json({ message: "Transport not found" });
    }

    await createActivityLog(
      userId,
      `User updated transport details - ${transport?.name}`
    );

    return res.status(200).json({ message: "Transport updated successfully" });
  } catch (error) {
    console.log("Error in update transport controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteTransport = async (req, res) => {
  try {
    const { recordId = undefined } = req.params;
    const { userId } = req?.user;

    if (!recordId) {
      return res.status(400).json({ message: "Transport ID is required" });
    }

    const transport = await Transport.findByIdAndDelete(recordId);

    if (!transport) {
      return res.status(404).json({ message: "Transport not found" });
    }

    await createActivityLog(userId, `User deleted transport - ${transport?.name}`);

    return res.status(200).json({ message: "Transport deleted successfully" });
  } catch (error) {
    console.log("Error in delete transport controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
