import createActivityLog from "../../helpers/createActivityLog.js";
import decryptUrlPayload from "../../lib/decryptUrlPayload.js";
import ChallanRecord from "../../models/challanRecord.model.js";
import mongoose from "mongoose";
import moment from "moment";
import fs from "fs";
import path from "path";

export const getChallanRecords = async (req, res) => {
  try {
    const { payload } = req.query;
    const {
      page = 1,
      size = 25,
      keyword = undefined,
      selectedBranch = undefined,
      selectedOutwardType = undefined,
      dateRange = undefined,
    } = decryptUrlPayload(payload);

    // Calculate the number of documents to skip
    const skip = (page - 1) * size;

    let matchQueryStage = [];

    // Search filter
    if (keyword !== undefined) {
      const words = keyword.split(" ");
      const searchConditions = words.map((word) => ({
        $or: [{ "partyInfo.name": { $regex: word, $options: "i" } }],
      }));

      matchQueryStage.push({
        $and: searchConditions,
      });
    }

    // Dropdown filters
    if (selectedBranch) {
      matchQueryStage.push({
        branch: new mongoose.Types.ObjectId(selectedBranch),
      });
    }
    if (selectedOutwardType) {
      matchQueryStage.push({
        outwardType: new mongoose.Types.ObjectId(selectedOutwardType),
      });
    }

    const result = await ChallanRecord.aggregate([
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
      {
        $lookup: {
          from: "partyrecords",
          localField: "party",
          foreignField: "_id",
          as: "partyInfo",
          pipeline: [
            {
              $project: {
                name: 1,
              },
            },
          ],
        },
      },
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
                from: "branches",
                localField: "branch",
                foreignField: "_id",
                as: "branchInfo",
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
                localField: "outwardType",
                foreignField: "_id",
                as: "outwardInfo",
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
                entryDate: 1,
                challanNo: 1,
                challanFile: 1,
                branch: {
                  $arrayElemAt: ["$branchInfo.name", 0],
                },
                partyName: {
                  $arrayElemAt: ["$partyInfo.name", 0],
                },
                outwardType: {
                  $arrayElemAt: ["$outwardInfo.name", 0],
                },
                totalWeight: 1,
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
    const challanRecords = result[0].paginatedResults;
    return res.status(200).json({ challanRecords, total });
  } catch (error) {
    console.log("Error in get challan records controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteChallanRecord = async (req, res) => {
  try {
    const { recordId = undefined } = req.params;
    const { userId } = req?.user;

    if (!recordId) {
      return res.status(400).json({ message: "Challan record ID is required" });
    }

    const deletedChallanRecord = await ChallanRecord.findByIdAndDelete(
      recordId
    );

    if (!deletedChallanRecord) {
      return res.status(404).json({ message: "Challan record not found" });
    }

    // Delete the file
    const fileName = deletedChallanRecord?.challanFile;
    if (fileName) {
      const filePath = path.join("uploads", "invoices", fileName);
      fs.unlink(filePath, (err) => {
        if (err) console.error("Error deleting file:", err.message);
      });
    }

    await createActivityLog(
      userId,
      `User deleted Challan - ${deletedChallanRecord?.challanNo}`
    );

    return res
      .status(200)
      .json({ message: "Challan record deleted successfully" });
  } catch (error) {
    console.log("Error in delete challan record controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
