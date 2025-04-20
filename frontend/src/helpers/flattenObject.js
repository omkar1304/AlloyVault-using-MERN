const getFlattenObject = (obj, parentKey = "", res = {}) => {
  for (let key in obj) {
    if (!obj.hasOwnProperty(key)) continue;

    const newKey = parentKey ? `${parentKey}.${key}` : key;

    if (
      typeof obj[key] === "object" &&
      obj[key] !== null &&
      !Array.isArray(obj[key])
    ) {
      getFlattenObject(obj[key], newKey, res);
    } else {
      res[newKey] = obj[key];
    }
  }

  return res;
};

export default getFlattenObject;
