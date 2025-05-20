import createActivityLog from "../../helpers/createActivityLog.js";
import decryptUrlPayload from "../../lib/decryptUrlPayload.js";
import decryptData from "../../lib/decryptData.js";
import PartyRecord from "../../models/partyRecord.model.js";
import mongoose from "mongoose";

export const getPartyRecords = async (req, res) => {
  try {
    const { payload } = req.query;
    const decrypted = decryptUrlPayload(payload);
    req.decryptedBody = decrypted;
    const {
      page = 1,
      size = 25,
      selectedBroker = undefined,
      selectedCountry = undefined,
      selectedState = undefined,
      selectedCity = undefined,
      keyword = undefined,
    } = decrypted;

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

    // Dropdown filters
    if (selectedBroker) {
      matchQueryStage.push({
        broker: new mongoose.Types.ObjectId(selectedBroker),
      });
    }
    if (selectedCountry) {
      matchQueryStage.push({ country: selectedCountry });
    }
    if (selectedState) {
      matchQueryStage.push({ state: selectedState });
    }
    if (selectedCity) {
      matchQueryStage.push({ city: selectedCity });
    }

    const result = await PartyRecord.aggregate([
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
                from: "countries",
                localField: "country",
                foreignField: "countryCode",
                as: "countryInfo",
              },
            },
            {
              $lookup: {
                from: "states",
                let: { country: "$country", state: "$state" },
                as: "stateInfo",
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $eq: ["$countryCode", "$$country"] },
                          { $eq: ["$stateCode", "$$state"] },
                        ],
                      },
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
                partyName: "$name",
                partyType: { $arrayElemAt: ["$partyTypeInfo.name", 0] },
                broker: { $arrayElemAt: ["$brokerInfo.name", 0] },
                gstNo: 1,
                city: 1,
                state: { $arrayElemAt: ["$stateInfo.name", 0] },
                pincode: 1,
                country: { $arrayElemAt: ["$countryInfo.name", 0] },
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

export const getPartyRecordsAsOption = async (req, res) => {
  try {
    const result = await PartyRecord.aggregate([
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
    console.log("Error in get party records option controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getPartyDetails = async (req, res) => {
  try {
    const { payload } = req.query;
    const decrypted = decryptUrlPayload(payload);
    req.decryptedBody = decrypted;
    const {
      recordId = undefined,
      searchBy = "id",
      partyName = undefined,
    } = decrypted;

    if (searchBy === "id" && !recordId) {
      return res.status(400).json({ message: "Party record ID is missing" });
    }

    if (searchBy === "name" && !partyName) {
      return res.status(400).json({ message: "Party name is missing" });
    }

    let partyRecord = null;
    switch (searchBy) {
      case "id":
        partyRecord = await PartyRecord.findById(recordId);
        break;
      case "name":
        partyRecord = await PartyRecord.findOne({ name: partyName });
        break;
      default:
        partyRecord = null;
    }

    if (!partyRecord) {
      return res.status(404).json({ message: "Party record not found" });
    }

    return res.status(200).send(partyRecord);
  } catch (error) {
    console.log("Error in party details record controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const addPartyRecord = async (req, res) => {
  try {
    const payload = decryptData(req.body.payload);
    req.decryptedBody = payload;
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
    req.decryptedBody = payload;
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
