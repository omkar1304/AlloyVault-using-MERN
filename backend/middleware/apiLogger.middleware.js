import ApiLog from "../models/apiLog.model.js";

const apiLogger = async (req, res, next) => {
  const start = Date.now();
  const oldSend = res.send;
  let responseBody;

  res.send = function (body) {
    responseBody = body;
    return oldSend.call(this, body);
  };

  res.on("finish", async () => {
    const duration = Date.now() - start;

    const log = new ApiLog({
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      requestBody: req.decryptedBody || req.body,
      responseBody: tryParseJson(responseBody),
      errorMessage: res.locals.errorMessage || null,
      requestedBy: req?.user?.userId || null,
      responseTime: duration,
    });

    try {
      await log.save();
    } catch (error) {
      console.error("Error saving API log:", error.message);
    }
  });

  next();
};

function tryParseJson(data) {
  try {
    return typeof data === "string" ? JSON.parse(data) : data;
  } catch {
    return data;
  }
}

export default apiLogger;
