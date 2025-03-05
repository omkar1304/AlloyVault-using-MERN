import CryptoJS from "crypto-js";

const SECRET_KEY = import.meta.env.VITE_ENC_DEC_SECRET_KEY;

const decryptData = (encryptedData) => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
  const decrypted = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  return decrypted;
};

export default decryptData;
