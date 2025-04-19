import mongoose from "mongoose";
import User from "../../models/user.model.js";
import decryptUrlPayload from "../../lib/decryptUrlPayload.js";
import decryptData from "./../../lib/decryptData.js";
import createActivityLog from "../../helpers/createActivityLog.js";

export const getUsers = async (req, res) => {
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
        $or: [{ displayName: { $regex: word, $options: "i" } }],
      }));

      matchQueryStage.push({
        $and: searchConditions,
      });
    }

    const result = await User.aggregate([
      // Keyword filter
      ...(matchQueryStage.length
        ? [{ $match: { $and: matchQueryStage } }]
        : []),
      { $sort: { displayName: 1 } },
      {
        $facet: {
          totalCount: [{ $count: "count" }],
          paginatedResults: [
            { $skip: skip },
            { $limit: size },
            {
              $lookup: {
                from: "roles",
                localField: "role",
                foreignField: "_id",
                as: "roleInfo",
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
              $project: {
                _id: 1,
                displayName: 1,
                roleName: { $arrayElemAt: ["$roleInfo.name", 0] },
                email: 1,
                createdAt: 1,
                updatedAt: 1,
                isAdminApproved: 1
              },
            },
          ],
        },
      },
    ]);
    const total =
      result[0].totalCount.length > 0 ? result[0].totalCount[0].count : 0;
    const users = result[0].paginatedResults;
    return res.status(200).json({ users, total });
  } catch (error) {
    console.log("Error in get users controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getUserDetails = async (req, res) => {
  try {
    const { userId = undefined } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "User Id is missing!" });
    }

    const user = await User.findById(userId)?.select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.log("Error in user details controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { recordId = undefined } = req.params;
    const payload = decryptData(req.body.payload);
    const { userId } = req?.user;

    if (!recordId) {
      return res.status(400).json({ message: "User ID is missing" });
    }

    const user = await User.findByIdAndUpdate(recordId, {
      $set: {
        ...payload,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await createActivityLog(
      userId,
      `User updated records for ${user?.displayName}`
    );

    return res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    console.log("Error in update user controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
