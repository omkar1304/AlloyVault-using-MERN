const verifyToken = () => {
  try {
    const token = localStorage.getItem("token");
    return token ? true : false;
  } catch (error) {
    return false;
  }
};

export default verifyToken;
