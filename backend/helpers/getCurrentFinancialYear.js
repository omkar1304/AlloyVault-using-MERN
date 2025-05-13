const getCurrentFinancialYear = () => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const month = now.getMonth() + 1;
  const fyStartYear = month >= 4 ? currentYear : currentYear - 1;
  const fyEndYear = fyStartYear + 1;
  return `${fyStartYear.toString().slice(-2)}-${fyEndYear
    .toString()
    .slice(-2)}`;
};
export default getCurrentFinancialYear;
