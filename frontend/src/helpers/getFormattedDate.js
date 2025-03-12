import momentTZ from "moment-timezone";
const getFormattedDate = (date = null, isTimeFormat = false) => {
  if (!date) return null;
  const dateformat = isTimeFormat ? "DD/MM/YYYY hh:mm:ss A" : "DD/MM/YYYY";
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const localTime = momentTZ.utc(date).tz(userTimeZone).format(dateformat);

  return localTime;
};

export default getFormattedDate;
