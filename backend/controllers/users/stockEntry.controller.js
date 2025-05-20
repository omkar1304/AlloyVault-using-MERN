import createActivityLog from "../../helpers/createActivityLog.js";
import decryptUrlPayload from "../../lib/decryptUrlPayload.js";
import decryptData from "../../lib/decryptData.js";
import StockEntry from "../../models/stockEntry.model.js";
import Option from "../../models/options.model.js";
import mongoose from "mongoose";
import moment from "moment";
import generateInvoicePDF from "../../helpers/generateInvoicePDF.js";
import generateInvoiceDetails from "../../helpers/generateInvoiceDetails.js";
import getSafeInvoiceFileName from "../../helpers/getSafeInvoiceFileName.js";
import getCurrentFinancialYear from "../../helpers/getCurrentFinancialYear.js";
import InvoiceCounter from "../../models/invoiceCounter.model.js";
import ChallanRecord from "../../models/challanRecord.model.js";
import updateInvoiceCounter from "../../helpers/updateInvoiceCounter.js";

export const getStockEntries = async (req, res) => {
  try {
    const { payload } = req.query;
    const decrypted = decryptUrlPayload(payload);
    req.decryptedBody = decrypted;
    const {
      page = 1,
      size = 25,
      type = "Inward",
      keyword = undefined,
      selectedBranch = undefined,
      selectedGrade = undefined,
      selectedShape = undefined,
      selectedInwardType = undefined,
      selectedOutwardType = undefined,
      selectedBtType = undefined,
      dateRange = undefined,
    } = decrypted;

    // Calculate the number of documents to skip
    const skip = (page - 1) * size;

    let matchQueryStage = [];

    // Search filter
    if (keyword !== undefined) {
      const words = keyword.split(" ");
      const searchConditions = words.map((word) => ({
        $or: [
          { "partyInfo.name": { $regex: word, $options: "i" } },
          { "gradeInfo.name": { $regex: word, $options: "i" } },
          { "shapeInfo.name": { $regex: word, $options: "i" } },
          { size: { $regex: word, $options: "i" } },
          // If possible then convert into number and add condition
          ...(!isNaN(words) && str.trim() !== ""
            ? [{ size: { $regex: Number(word), $options: "i" } }]
            : []),
        ],
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
    if (selectedGrade) {
      matchQueryStage.push({
        grade: new mongoose.Types.ObjectId(selectedGrade),
      });
    }
    if (selectedShape) {
      matchQueryStage.push({
        shape: new mongoose.Types.ObjectId(selectedShape),
      });
    }
    if (selectedInwardType) {
      matchQueryStage.push({
        inwardType: new mongoose.Types.ObjectId(selectedInwardType),
      });
    }

    if (selectedOutwardType) {
      matchQueryStage.push({
        outwardType: new mongoose.Types.ObjectId(selectedOutwardType),
      });
    }
    if (selectedBtType) {
      matchQueryStage.push({
        btType: new mongoose.Types.ObjectId(selectedBtType),
      });
    }

    const result = await StockEntry.aggregate([
      {
        $match: {
          type,
        },
      },
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
      // If inward is type then customer is party key
      // If onward is type then customer is billTo key
      {
        $lookup: {
          from: "partyrecords",
          localField: type === "Inward" ? "party" : "billTo",
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
      {
        $lookup: {
          from: "options",
          localField: "grade",
          foreignField: "_id",
          as: "gradeInfo",
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
          localField: "shape",
          foreignField: "_id",
          as: "shapeInfo",
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
                localField: "inwardType",
                foreignField: "_id",
                as: "inwardInfo",
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
                from: "options",
                localField: "btType",
                foreignField: "_id",
                as: "btInfo",
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
                localField: "materialType",
                foreignField: "_id",
                as: "materialTypeInfo",
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
                branch: {
                  $arrayElemAt: ["$branchInfo.name", 0],
                },
                inwardType: {
                  $arrayElemAt: ["$inwardInfo.name", 0],
                },
                outwardType: {
                  $arrayElemAt: ["$outwardInfo.name", 0],
                },
                btType: {
                  $arrayElemAt: ["$btInfo.name", 0],
                },
                customer: {
                  $arrayElemAt: ["$partyInfo.name", 0],
                },
                materialType: {
                  $arrayElemAt: ["$materialTypeInfo.name", 0],
                },
                grade: {
                  $arrayElemAt: ["$gradeInfo.name", 0],
                },
                size: 1,
                shape: {
                  $arrayElemAt: ["$shapeInfo.name", 0],
                },
                weight: 1,
                rackNo: 1,
                transportName: 1,
                challanNo: 1,
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

export const addStockEntryForInward = async (req, res) => {
  try {
    const payload = decryptData(req.body.payload);
    req.decryptedBody = payload;
    const {
      shipmentData,
      items = [],
      type = undefined,
      totalWeight = 0,
    } = payload;
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
      `User added ${type} stock on ${moment(shipmentData?.entryDate).format(
        "DD/MM/YYYY hh:mm:ss A"
      )}`
    );

    return res.status(200).json({ message: "Stock record added successfully" });
  } catch (error) {
    console.log("Error in add stock entry record controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const addStockEntryForOutward = async (req, res) => {
  try {
    const payload = decryptData(req.body.payload);
    req.decryptedBody = payload;
    const {
      shipmentData,
      items = [],
      type = undefined,
      totalWeight = 0,
    } = payload;
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
      `User added ${type} stock on ${moment(shipmentData?.entryDate).format(
        "DD/MM/YYYY hh:mm:ss A"
      )}`
    );

    // Step 1 - Generate PDF
    const resultObj = await generateInvoiceDetails({
      challanId: shipmentData?.challanNo,
      type,
    });
    const pdfData = {
      challanId: shipmentData?.challanNo,
      previewData: resultObj,
    };
    const safeFileName = await generateInvoicePDF(
      pdfData,
      getSafeInvoiceFileName(shipmentData?.challanNo)
    );
    const challanRecord = await ChallanRecord({
      entryDate: shipmentData?.entryDate,
      challanNo: shipmentData?.challanNo,
      challanFile: safeFileName,
      branch: shipmentData?.branch,
      party: shipmentData?.billTo,
      outwardType: shipmentData?.outwardType,
      totalWeight,
      typeEntry: type,
      createdBy: userId,
    }).save();
    if (!challanRecord) {
      return res
        .status(500)
        .json({ message: "Error in creating challan record" });
    }
    await createActivityLog(
      userId,
      `Challan - ${shipmentData?.challanNo} invoice generated successfully!`
    );
    // Step 2 - Update Counter for given branch
    await updateInvoiceCounter(shipmentData?.branch);

    return res.status(200).json({ message: "Stock record added successfully" });
  } catch (error) {
    console.log("Error in add stock entry record controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const addStockEntryForBT = async (req, res) => {
  try {
    const payload = decryptData(req.body.payload);
    req.decryptedBody = payload;
    const {
      shipmentData,
      items = [],
      type = undefined,
      totalWeight = 0,
    } = payload;
    const { userId } = req?.user;

    if (!type) {
      return res.status(400).json({ message: "Type not defined" });
    }

    if (!items?.length) {
      return res
        .status(400)
        .json({ message: "At least one item present to add!" });
    }

    const btIn = await Option.findOne({ type: 8, name: /In/i });
    const btOut = await Option.findOne({ type: 8, name: /Out/i });

    const formattedDataForBtIn = items?.map((item) => {
      return {
        ...shipmentData,
        ...item,
        type,
        branch: shipmentData?.toBranch,
        btType: btIn?._id,
        createdBy: userId,
      };
    });

    const formattedDataForBtOut = items?.map((item) => {
      return {
        ...shipmentData,
        ...item,
        type,
        branch: shipmentData?.fromBranch,
        btType: btOut?._id,
        createdBy: userId,
      };
    });

    const allStockEntries = await StockEntry.insertMany([
      ...formattedDataForBtIn,
      ...formattedDataForBtOut,
    ]);
    if (!allStockEntries) {
      return res
        .status(500)
        .json({ message: "Something went wrong while adding records" });
    }

    await createActivityLog(
      userId,
      `User added ${type} stock on ${moment(shipmentData?.entryDate).format(
        "DD/MM/YYYY hh:mm:ss A"
      )}`
    );

    // If bt type is BT-IN then take toBranch
    // If bt type is BT-OUT then take fromBranch
    const recordBranch =
      shipmentData?.btType === btIn?._id
        ? shipmentData?.toBranch
        : shipmentData?.fromBranch;

    // Step 1 - Generate PDF
    const resultObj = await generateInvoiceDetails({
      challanId: shipmentData?.challanNo,
      type,
      toBranch: shipmentData?.toBranch,
      fromBranch: shipmentData?.fromBranch,
    });
    const pdfData = {
      challanId: shipmentData?.challanNo,
      previewData: resultObj,
    };
    const safeFileName = await generateInvoicePDF(
      pdfData,
      getSafeInvoiceFileName(shipmentData?.challanNo)
    );
    const challanRecord = await ChallanRecord({
      entryDate: shipmentData?.entryDate,
      challanNo: shipmentData?.challanNo,
      challanFile: safeFileName,
      branch: recordBranch,
      btType: shipmentData?.btType,
      totalWeight,
      typeEntry: type,
      createdBy: userId,
    }).save();
    if (!challanRecord) {
      return res
        .status(500)
        .json({ message: "Error in creating challan record" });
    }
    await createActivityLog(
      userId,
      `Challan - ${shipmentData?.challanNo} invoice generated successfully!`
    );

    // Step 2 - Update Counter for given branch
    await updateInvoiceCounter(recordBranch);

    return res.status(200).json({ message: "Stock record added successfully" });
  } catch (error) {
    console.log("Error in add stock entry record controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getStockEntryDetails = async (req, res) => {
  try {
    const { payload } = req.query;
    const decrypted = decryptUrlPayload(payload);
    req.decryptedBody = decrypted;
    const { recordId = undefined } = decrypted;

    if (!recordId) {
      return res.status(400).json({ message: "Stock record ID is missing" });
    }

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
    req.decryptedBody = payload;
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
      `User updated ${stockEntryRecord?.type} stock`
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

    await createActivityLog(userId, `User deleted stock`);

    return res
      .status(200)
      .json({ message: "Stock entry deleted successfully" });
  } catch (error) {
    console.log("Error in delete Stock entry controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
