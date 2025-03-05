import CryptoJS from "crypto-js";
import dotenv from "dotenv";

dotenv.config();
const SECRET_KEY = process.env.ENC_DEC_SECRET_KEY;

const encryptData = (data) => {
  const encrypted = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    SECRET_KEY
  ).toString();
  return encrypted;
};

export default encryptData;
