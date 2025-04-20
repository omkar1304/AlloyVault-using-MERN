import mongoose from "mongoose";
import decryptUrlPayload from "../../lib/decryptUrlPayload.js";
import Company from "../../models/company.model.js";
import decryptData from "./../../lib/decryptData.js";
import createActivityLog from "../../helpers/createActivityLog.js";

export const getCompanies = async (req, res) => {
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

    const result = await Company.aggregate([
      ...(matchQueryStage.length
        ? [{ $match: { $and: matchQueryStage } }]
        : []),
      {
        $facet: {
          totalCount: [{ $count: "count" }],
          paginatedResults: [
            { $skip: skip },
            { $limit: size },
            {
              $lookup: {
                from: "options",
                localField: "branches",
                foreignField: "_id",
                as: "branchesInfo",
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
                name: 1,
                mobile: 1,
                email: 1,
                branchesInfo: 1,
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
    const companies = result[0].paginatedResults;
    return res.status(200).json({ companies, total });
  } catch (error) {
    console.log("Error in get companies controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getCompanyDetails = async (req, res) => {
  try {
    const { payload } = req.query;
    const { recordId = undefined } = decryptUrlPayload(payload);

    if (!recordId) {
      return res.status(400).json({ message: "Company ID is missing" });
    }

    const companyRecord = await Company.findById(recordId);

    if (!companyRecord) {
      return res.status(404).json({ message: "Company not found" });
    }

    return res.status(200).send(companyRecord);
  } catch (error) {
    console.log("Error in company record controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const addCompany = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const imgURL = req?.file?.filename;
    const payload = req?.body;
    const { name, branches } = payload;
    const { userId } = req?.user;

    const exisitingCompany = await Company.findOne({ name: name });
    if (exisitingCompany) {
      return res
        .status(400)
        .json({ message: "Company already exists with given name!" });
    }

    const company = new Company({
      ...payload,
      branches: branches
        ?.split(",")
        ?.map((branch) => new mongoose.Types.ObjectId(branch)),
      imgURL,
      createdBy: userId,
    });
    await company.save();

    await createActivityLog(userId, `User added company - ${company?.name}`);

    return res.status(201).json({ message: "Company added successfully" });
  } catch (error) {
    console.log("Error in add company controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateCompany = async (req, res) => {
  try {
    const { recordId = undefined } = req.params;
    const payload = req?.body;
    const { userId } = req?.user;

    if (!recordId) {
      return res.status(400).json({ message: "Company ID is missing" });
    }

    let updateObj = {};
    updateObj.$set = { ...payload };

    if (req?.file && req?.file?.filename) {
      updateObj.$set.imgURL = req?.file?.filename;
    }

    if (req?.body?.branches && req?.body?.branches.length) {
      updateObj.$set.branches = req?.body?.branches
        ?.split(",")
        ?.map((branch) => new mongoose.Types.ObjectId(branch));
    }

    const companyRecord = await Company.findByIdAndUpdate(recordId, updateObj);

    if (!companyRecord) {
      return res.status(404).json({ message: "Company not found" });
    }

    await createActivityLog(
      userId,
      `User updated ${companyRecord?.name} details`
    );

    return res.status(200).json({ message: "Company updated successfully" });
  } catch (error) {
    console.log("Error in update company record controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteCompany = async (req, res) => {
  try {
    const { recordId = undefined } = req.params;
    const { userId } = req?.user;

    if (!recordId) {
      return res.status(400).json({ message: "Company ID is missing!" });
    }

    const company = await Company.findByIdAndDelete(recordId);

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    await createActivityLog(userId, `User deleted company - ${company?.name}`);

    return res.status(200).json({ message: "Company deleted successfully" });
  } catch (error) {
    console.log("Error in delete company controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
