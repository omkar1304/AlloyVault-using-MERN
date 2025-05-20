import decryptUrlPayload from "../../lib/decryptUrlPayload.js";
import Country from "./../../models/country.model.js";
import State from "./../../models/state.model.js";
import City from "./../../models/city.model.js";

export const getCountriesAsOption = async (req, res) => {
  try {
    const result = await Country.aggregate([
      {
        $sort: { name: 1 },
      },
      {
        $project: {
          _id: 0,
          label: "$name",
          value: "$countryCode",
        },
      },
    ]);
    return res.status(200).send(result);
  } catch (error) {
    console.log("Error in get countries options controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getStatesAsOption = async (req, res) => {
  try {
    const { payload } = req.query;
    const decrypted = decryptUrlPayload(payload);
    req.decryptedBody = decrypted;
    const { countryCode = undefined } = decrypted;

    const result = await State.aggregate([
      ...(countryCode
        ? [
            {
              $match: { countryCode },
            },
          ]
        : []),
      {
        $sort: { name: 1 },
      },
      {
        $project: {
          _id: 0,
          label: "$name",
          value: "$stateCode",
        },
      },
    ]);
    return res.status(200).send(result);
  } catch (error) {
    console.log("Error in get states options controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getCitiesAsOption = async (req, res) => {
  try {
    const { payload } = req.query;
    const decrypted = decryptUrlPayload(payload);
    req.decryptedBody = decrypted;
    const { countryCode = undefined, stateCode = undefined } = decrypted;

    const result = await City.aggregate([
      ...(stateCode && countryCode
        ? [
            {
              $match: { countryCode, stateCode },
            },
          ]
        : []),
      {
        $sort: { name: 1 },
      },
      {
        $project: {
          _id: 0,
          label: "$name",
          value: "$name",
        },
      },
    ]);
    return res.status(200).send(result);
  } catch (error) {
    console.log("Error in get cities options controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
