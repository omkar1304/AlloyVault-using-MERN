import CryptoJS from "crypto-js";

const SECRET_KEY = import.meta.env.VITE_ENC_DEC_SECRET_KEY;

const decryptString = (encodedCiphertext) => {
  try {
    const ciphertext = decodeURIComponent(encodedCiphertext);
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
    const decrypted = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return decrypted;
  } catch (error) {
    return null;
  }
};

export default decryptString;
