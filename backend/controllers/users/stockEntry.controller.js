import createActivityLog from "../../helpers/createActivityLog.js";
import decryptUrlPayload from "../../lib/decryptUrlPayload.js";
import decryptData from "../../lib/decryptData.js";
import StockEntry from "../../models/stockEntry.model.js";
import mongoose from "mongoose";
import moment from "moment"

export const getStockEntries = async (req, res) => {
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

    const result = await StockEntry.aggregate([
      // Keyword filter
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
