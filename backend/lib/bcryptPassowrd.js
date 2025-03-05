import bcrypt from "bcrypt";

const SALT_WORK_FACTOR = 10;

export const getHashedPassword = async (password) => {
  const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

export const compareHashedPassword = async (rawPassword, hashedPassword) => {
  return await bcrypt.compare(rawPassword, hashedPassword);
};
