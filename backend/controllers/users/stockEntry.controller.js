import createActivityLog from "../../helpers/createActivityLog.js";
import decryptUrlPayload from "../../lib/decryptUrlPayload.js";
import decryptData from "../../lib/decryptData.js";
import StockEntry from "../../models/stockEntry.model.js";
import mongoose from "mongoose";
import moment from "moment";

export const getStockEntries = async (req, res) => {
  try {
    const { payload } = req.query;
    const {
      page = 1,
      size = 25,
      keyword = undefined,
      selectedBranch = undefined,
      selectedGrade = undefined,
      selectedShape = undefined,
      selectedMaterialType = undefined,
      dateRange = undefined,
    } = decryptUrlPayload(payload);

    // Calculate the number of documents to skip
    const skip = (page - 1) * size;

    let matchQueryStage = [];

    // Search filter
    if (keyword !== undefined) {
      const words = keyword.split(" ");
      const searchConditions = words.map((word) => ({
        $or: [
          { grade: { $regex: word, $options: "i" } },
          { company: { $regex: word, $options: "i" } },
          { rackNo: { $regex: word, $options: "i" } },
        ],
      }));

      matchQueryStage.push({
        $and: searchConditions,
      });
    }

    // Dropdown filters
    if (selectedBranch) {
      matchQueryStage.push({
        branch: selectedBranch,
      });
    }
    if (selectedGrade) {
      matchQueryStage.push({ grade: selectedGrade });
    }
    if (selectedShape) {
      matchQueryStage.push({ shape: selectedShape });
    }
    if (selectedMaterialType) {
      matchQueryStage.push({ materialType: selectedMaterialType });
    }

    const result = await StockEntry.aggregate([
      // Date range filter
      ...(dateRange != undefined
        ? [
            {
              $match: {
                $and: [
                  {
                    entryDate: {
                      $gte: new Date(moment(dateRange.start).toISOString()),
                    },
                  },
                  {
                    entryDate: {
                      $lte: new Date(
                        moment(dateRange.end).add(24, "hours").toISOString()
                      ),
                    },
                  },
                ],
              },
            },
          ]
        : []),
      ...(matchQueryStage.length
        ? [{ $match: { $and: matchQueryStage } }]
        : []),
      {
        $sort: { entryDate: -1 },
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
                entryDate: 1,
                branch: 1,
                customer: "$company",
                materialType: 1,
                materialClass: 1,
                grade: 1,
                size: 1,
                shape: 1,
                weight: 1,
                rackNo: 1,
                transportName: 1,
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
    const stockEntryRecords = result[0].paginatedResults;
    return res.status(200).json({ stockEntryRecords, total });
  } catch (error) {
    console.log("Error in get stock entry records controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const addStockEntry = async (req, res) => {
  try {
    const payload = decryptData(req.body.payload);
    const { shipmentData, items = [], type = undefined } = payload;
    const { userId } = req?.user;

    if (!type) {
      return res.status(400).json({ message: "Type not defined" });
    }

    if (!items?.length) {
      return res
        .status(400)
        .json({ message: "At least one item present to add!" });
    }

    const formattedData = items?.map((item) => {
      return {
        ...shipmentData,
        ...item,
        type,
        createdBy: userId,
      };
    });

    const allStockEntries = await StockEntry.insertMany(formattedData);
    if (!allStockEntries) {
      return res
        .status(500)
        .json({ message: "Something went wrong while adding records" });
    }

    await createActivityLog(
      userId,
      `User added ${type} stock to branch ${shipmentData?.branch} on ${moment(
        shipmentData?.entryDate
      ).format("DD/MM/YYYY hh:mm:ss A")}`
    );

    return res.status(200).json({ message: "Stock record added successfully" });
  } catch (error) {
    console.log("Error in add stock entry record controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getStockEntryDetails = async (req, res) => {
  try {
    const { payload } = req.query;
    const { recordId = undefined } = decryptUrlPayload(payload);

    if (!recordId) {
      return res.status(400).json({ message: "Stock record ID is missing" });
    }

    console.log("recordId", recordId)

    const stockEntryRecord = await StockEntry.findById(recordId);

    if (!stockEntryRecord) {
      return res.status(404).json({ message: "Stock entry not found" });
    }

    return res.status(200).send(stockEntryRecord);
  } catch (error) {
    console.log("Error in stock entry record controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateStockEntry = async (req, res) => {
  try {
    const { recordId = undefined } = req.params;
    const payload = decryptData(req.body.payload);
    const { userId } = req?.user;

    if (!recordId) {
      return res.status(400).json({ message: "Stock record ID is missing" });
    }

    const stockEntryRecord = await StockEntry.findByIdAndUpdate(recordId, {
      $set: {
        ...payload,
      },
    });

    if (!stockEntryRecord) {
      return res.status(404).json({ message: "Stock entry not found" });
    }

    await createActivityLog(
      userId,
      `User updated ${stockEntryRecord?.type} stock for branch ${stockEntryRecord?.branch}`
    );

    return res
      .status(200)
      .json({ message: "stock Entry Record updated successfully" });
  } catch (error) {
    console.log(
      "Error in update stock entry record controller:",
      error.message
    );
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteStockEntry = async (req, res) => {
  try {
    const { recordId = undefined } = req.params;
    const { userId } = req?.user;

    if (!recordId) {
      return res.status(400).json({ message: "Stock record ID is missing" });
    }

    const deletedStockEntry = await StockEntry.findByIdAndDelete(recordId);

    if (!deletedStockEntry) {
      return res.status(404).json({ message: "Stock entry not found" });
    }

    await createActivityLog(
      userId,
      `User deleted stock for branch ${deletedStockEntry?.branch}`
    );

    return res
      .status(200)
      .json({ message: "Stock entry deleted successfully" });
  } catch (error) {
    console.log("Error in delete Stock entry controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
