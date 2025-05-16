import createActivityLog from "../../helpers/createActivityLog.js";
import decryptData from "../../lib/decryptData.js";
import decryptUrlPayload from "../../lib/decryptUrlPayload.js";
import Branch from "../../models/branch.model.js";

export const getBranches = async (req, res) => {
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

    const result = await Branch.aggregate([
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
                prefix: 1,
                isEnabled: 1,
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
    const branches = result[0].paginatedResults;
    return res.status(200).json({ branches, total });
  } catch (error) {
    console.log("Error in get branches controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getBranchAsOption = async (req, res) => {
  try {
    const result = await Branch.aggregate([
      {
        $match: {
          isEnabled: true,
        },
      },
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
    console.log("Error in get branch as option controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getBranchDetails = async (req, res) => {
  try {
    const { payload } = req.query;
    const { recordId = undefined } = decryptUrlPayload(payload);

    if (!recordId) {
      return res.status(400).json({ message: "Branch ID is missing" });
    }

    const branch = await Branch.findById(recordId);

    if (!branch) {
      return res.status(404).json({ message: "Branch not found" });
    }

    return res.status(200).send(branch);
  } catch (error) {
    console.log("Error in branch details controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const addBranch = async (req, res) => {
  try {
    const payload = decryptData(req.body.payload);
    const { userId } = req?.user;

    const newBranch = await Branch({
      ...payload,
      createdBy: userId,
    }).save();

    if (!newBranch) {
      return res.status(500).json({ message: "Internal Server Error" });
    }

    await createActivityLog(userId, `User added branch - ${newBranch?.name}`);

    return res.status(200).json({ message: "branch added successfully" });
  } catch (error) {
    console.log("Error in add branch controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateBranch = async (req, res) => {
  try {
    const { recordId = undefined } = req.params;
    const payload = decryptData(req.body.payload);
    const { userId } = req?.user;

    if (!recordId) {
      return res.status(400).json({ message: "Branch ID is missing" });
    }

    const branch = await Branch.findByIdAndUpdate(recordId, {
      $set: {
        ...payload,
      },
    });

    if (!branch) {
      return res.status(404).json({ message: "Branch not found" });
    }

    await createActivityLog(
      userId,
      `User updated branch details - ${branch?.name}`
    );

    return res.status(200).json({ message: "branch updated successfully" });
  } catch (error) {
    console.log("Error in update branch controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteBranch = async (req, res) => {
  try {
    const { recordId = undefined } = req.params;
    const { userId } = req?.user;

    if (!recordId) {
      return res.status(400).json({ message: "Branch ID is required" });
    }

    const branch = await Branch.findByIdAndDelete(recordId);

    if (!branch) {
      return res.status(404).json({ message: "Branch not found" });
    }

    await createActivityLog(userId, `User deleted branch - ${branch?.name}`);

    return res.status(200).json({ message: "Branch deleted successfully" });
  } catch (error) {
    console.log("Error in delete branch controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
