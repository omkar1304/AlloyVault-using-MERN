const getSafeInvoiceFileName = (invoiceNumber) => {
  if (!invoiceNumber) return "invoice";
  return invoiceNumber.replace(/[\/\\]/g, "_");
};

export default getSafeInvoiceFileName;
