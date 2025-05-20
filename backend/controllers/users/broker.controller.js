import createActivityLog from "../../helpers/createActivityLog.js";
import Broker from "./../../models/broker.model.js";
import decryptData from "../../lib/decryptData.js";
import decryptUrlPayload from "../../lib/decryptUrlPayload.js";

export const getBrokersAsOption = async (req, res) => {
  try {
    const { payload } = req.query;
    const { sameAsLabel = false } = decryptUrlPayload(payload);
    const result = await Broker.aggregate([
      {
        $sort: { name: 1 },
      },
      {
        $project: {
          _id: 0,
          label: "$name",
          value: sameAsLabel ? "$name" : "$_id",
        },
      },
    ]);
    return res.status(200).send(result);
  } catch (error) {
    console.log("Error in get broker options controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const addBroker = async (req, res) => {
  try {
    const payload = decryptData(req.body.payload);
    req.decryptedBody = payload;
    const { name, panNo, mobile, address } = payload;
    const { userId } = req?.user;

    if (!name) {
      return res.status(400).json({ message: "Borker name is required" });
    }

    const newBroker = await Broker({
      name,
      panNo,
      mobile,
      address,
      createdBy: userId,
    }).save();

    if (!newBroker) {
      return res.status(500).json({ message: "Internal Server Error" });
    }

    await createActivityLog(userId, `User added broker - ${newBroker?.name}`);

    return res.status(200).json({ message: "Broker added successfully" });
  } catch (error) {
    console.log("Error in add broker controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateBroker = async (req, res) => {
  try {
    const { brokerId = undefined } = req.params;
    const payload = decryptData(req.body.payload);
    req.decryptedBody = payload;
    const { userId } = req?.user;

    if (!brokerId) {
      return res.status(400).json({ message: "Borker ID is missing" });
    }

    const broker = await Broker.findByIdAndUpdate(brokerId, {
      $set: {
        ...payload,
      },
    });

    if (!broker) {
      return res.status(404).json({ message: "Broker not found" });
    }

    await createActivityLog(userId, `User updated broker - ${broker?.name}`);

    return res.status(200).json({ message: "Broker updated successfully" });
  } catch (error) {
    console.log("Error in update broker controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteBroker = async (req, res) => {
  try {
    const { brokerId = undefined } = req.params;
    const { userId } = req?.user;

    if (!brokerId) {
      return res.status(400).json({ message: "Borker ID is missing" });
    }

    const deletedBroker = await Broker.findByIdAndDelete(brokerId);

    if (!deletedBroker) {
      return res.status(404).json({ message: "Broker not found" });
    }

    await createActivityLog(
      userId,
      `User deleted broker - ${deletedBroker?.name}`
    );

    return res.status(200).json({ message: "Broker deleted successfully" });
  } catch (error) {
    console.log("Error in delete broker controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
