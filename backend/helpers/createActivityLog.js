import ActivityLog from "../models/activityLog.model.js";

const createActivityLog = async (userId = null, action = "") => {
  try {
    if (!userId) return;
    const activityLog = new ActivityLog({ userId, action });
    await activityLog.save();
  } catch (error) {
    console.error("Error creating activity log:", error.message);
  }
};

export default createActivityLog;
