import Broker from "../models/broker.model.js";
import Company from "../models/company.model.js";
import Branch from "../models/branch.model.js";
import PartyRecord from "../models/partyRecord.model.js";
import StockEntry from "../models/stockEntry.model.js";
import mongoose from "mongoose";

const generateInvoiceDetails = async ({
  challanId,
  type,
  toBranch,
  fromBranch,
}) => {
  // To join shape and grade values
  const records = await StockEntry.aggregate([
    // If type is BT then avoid duplicate entries - match with challan and branch
    ...(type === "BT"
      ? [
          {
            $match: {
              challanNo: challanId,
              branch: new mongoose.Types.ObjectId(fromBranch),
            },
          },
        ]
      : // Else just match with challanNo
        [
          {
            $match: {
              challanNo: challanId,
            },
          },
        ]),
    {
      $match: {
        challanNo: challanId,
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
    {
      $addFields: {
        grade: {
          $arrayElemAt: ["$gradeInfo.name", 0],
        },
        shape: {
          $arrayElemAt: ["$shapeInfo.name", 0],
        },
      },
    },
  ]);

  if (!records?.length) {
    throw new Error("No records found");
  }

  // get the other values to join from any one record
  const {
    company,
    broker,
    billTo,
    shipTo,
    entryDate,
    transportName,
    shipmentDesc,
    vehicleNo,
  } = records?.[0];

  // Total weight and amount
  let totalWeight = 0;
  let totalAmount = 0;

  const items = records?.map((record) => {
    totalWeight = totalWeight + record?.weight;
    totalAmount =
      totalAmount +
      (record?.rate && record?.weight ? record?.rate * record?.weight : 0);
    return {
      unit: record?.unit ?? "",
      item: `${record?.grade} ${record?.size}mm ${record?.shape}`,
      hsnCode: record?.HSNCode ?? "",
      weight: `${record?.weight ?? 0}Kg`,
      rate: `${record?.rate ?? ""}/-`,
      amount: `${
        record?.rate && record?.weight
          ? parseFloat(record?.rate * record?.weight).toFixed(2)
          : ""
      }/-`,
    };
  });

  let resultObj;

  if (type === "Outward") {
    const [companyDetails, brokerDetails, shipDetails, billDetails] =
      await Promise.all([
        Company.findById(company),
        Broker.findById(broker),
        PartyRecord.findById(billTo),
        PartyRecord.findById(shipTo),
      ]);

    resultObj = {
      items,
      totalWeight,
      totalAmount,
      companyDetails,
      brokerDetails,
      shipDetails,
      billDetails,
      entryDate,
      transportName,
      shipmentDesc,
      type,
    };
  }

  if (type === "BT") {
    const [companyDetails, toBranchDetails, fromBranchDetails] =
      await Promise.all([
        Company.findById(company),
        Branch.findById(toBranch),
        Branch.findById(fromBranch),
      ]);

    resultObj = {
      items,
      totalWeight,
      totalAmount,
      companyDetails,
      toBranchDetails,
      fromBranchDetails,
      entryDate,
      transportName,
      vehicleNo,
      shipmentDesc,
      type,
    };
  }

  return resultObj;
};

export default generateInvoiceDetails;
