import CryptoJS from "crypto-js";

const SECRET_KEY = import.meta.env.VITE_ENC_DEC_SECRET_KEY;

const encryptData = (data) => {
  const encrypted = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    SECRET_KEY
  ).toString();
  return encrypted;
};

export default encryptData;
