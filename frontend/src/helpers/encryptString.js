import CryptoJS from "crypto-js";

const SECRET_KEY = import.meta.env.VITE_ENC_DEC_SECRET_KEY;

const encryptString = (data) => {
  try {
    const encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(data),
      SECRET_KEY
    ).toString();
    const encoded = encodeURIComponent(encrypted);
    return encoded;
  } catch (error) {
    return null;
  }
};

export default encryptString;
