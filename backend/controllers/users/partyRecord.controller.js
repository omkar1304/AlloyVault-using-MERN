import createActivityLog from "../../helpers/createActivityLog.js";
import decryptUrlPayload from "../../lib/decryptUrlPayload.js";
import decryptData from "../../lib/decryptData.js";
import PartyRecord from "../../models/partyRecord.model.js";

export const getPartyRecords = async (req, res) => {
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
        $or: [{ name: { $regex: word, $options: "i" } }],
      }));

      matchQueryStage.push({
        $and: searchConditions,
      });
    }

    const result = await PartyRecord.aggregate([
      {
        $lookup: {
          from: "brokers",
          localField: "broker",
          foreignField: "_id",
          as: "brokerInfo",
          pipeline: [
            {
              $project: {
                name: 1,
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
              $lookup: {
                from: "options",
                localField: "partyType",
                foreignField: "_id",
                as: "partyTypeInfo",
                pipeline: [
                  {
                    $project: {
                      name: 1,
                    },
                  },
                ],
              },
            },
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
                companyName: "$name",
                partyType: { $arrayElemAt: ["$partyTypeInfo.name", 0] },
                broker: { $arrayElemAt: ["$brokerInfo.name", 0] },
                gstNo: 1,
                city: 1,
                state: 1,
                pincode: 1,
                country: 1,
                mobile: 1,
                email: 1,
                createdBy: {
                  $arrayElemAt: ["$createdByInfo.displayName", 0],
                },
              },
            },
          ],
        },
      },
    ]);
    const total =
      result[0].totalCount.length > 0 ? result[0].totalCount[0].count : 0;
    const partyRecords = result[0].paginatedResults;
    return res.status(200).json({ partyRecords, total });
  } catch (error) {
    console.log("Error in get party records controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const addPartyRecord = async (req, res) => {
  try {
    const payload = decryptData(req.body.payload);
    const { userId } = req?.user;

    const newPartyRecord = await PartyRecord({
      ...payload,
      createdBy: userId,
    }).save();

    if (!newPartyRecord) {
      return res.status(500).json({ message: "Internal Server Error" });
    }

    await createActivityLog(
      userId,
      `User added party - ${newPartyRecord?.name}`
    );

    return res.status(200).json({ message: "Party record added successfully" });
  } catch (error) {
    console.log("Error in add party record controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updatePartyRecord = async (req, res) => {
  try {
    const { recordId = undefined } = req.params;
    const payload = decryptData(req.body.payload);
    const { userId } = req?.user;

    if (!recordId) {
      return res.status(400).json({ message: "Party record ID is missing" });
    }

    const partyRecord = await PartyRecord.findByIdAndUpdate(recordId, {
      $set: {
        ...payload,
      },
    });

    if (!partyRecord) {
      return res.status(404).json({ message: "Party record not found" });
    }

    await createActivityLog(
      userId,
      `User updated party details - ${partyRecord?.name}`
    );

    return res
      .status(200)
      .json({ message: "party record updated successfully" });
  } catch (error) {
    console.log("Error in update party record controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deletePartyRecord = async (req, res) => {
  try {
    const { recordId = undefined } = req.params;
    const { userId } = req?.user;

    if (!recordId) {
      return res.status(400).json({ message: "Party record ID is required" });
    }

    const deletedPartyRecord = await PartyRecord.findByIdAndDelete(recordId);

    if (!deletedPartyRecord) {
      return res.status(404).json({ message: "Party record not found" });
    }

    await createActivityLog(
      userId,
      `User deleted party - ${deletedPartyRecord?.name}`
    );

    return res
      .status(200)
      .json({ message: "Party record deleted successfully" });
  } catch (error) {
    console.log("Error in delete party record controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
