import mongoose from "mongoose";
import decryptUrlPayload from "../../lib/decryptUrlPayload.js";
import Role from "../../models/role.model.js";
import decryptData from './../../lib/decryptData.js';

export const getRoles = async (req, res) => {
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

    const result = await Role.aggregate([
      // Keyword filter
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
                from: "users",
                localField: "_id",
                foreignField: "role",
                as: "assignedUsers",
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
                assignedUsers: 1,
                createdBy: {
                  $arrayElemAt: ["$createdByInfo.displayName", 0],
                },
                perms: 1,
                name: 1,
                createdAt: 1,
                updatedAt: 1,
              },
            },
          ],
        },
      },
    ]);
    const total =
      result[0].totalCount.length > 0 ? result[0].totalCount[0].count : 0;
    const roles = result[0].paginatedResults;
    return res.status(200).json({ roles, total });
  } catch (error) {
    console.log("Error in get roles controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const addRole = async (req, res) => {
  try {
    const { name } = decryptData(req.body.payload);
    const { userId } = req?.user;

    const exisitingRole = await Role.findOne({ name})
    if(exisitingRole) {
      return res.status(400).json({ message: "Role already exists with given name!" });
    }

    const role = new Role({
      name,
      createdBy: userId,
    });
    await role.save();

    return res.status(201).json({ message: "Role added successfully" });
  } catch (error) {
    console.log("Error in add role controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
