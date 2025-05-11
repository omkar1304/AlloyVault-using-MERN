import moment from "moment";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ITEMS_PER_PAGE = 4;

const imageToBase64 = (imagePath) => {
  const image = fs.readFileSync(imagePath);
  const mimeType =
    path.extname(imagePath).toLowerCase() === ".png"
      ? "image/png"
      : "image/jpeg";
  return `data:${mimeType};base64,${image.toString("base64")}`;
};

const generateInvoiceHTML = (data) => {
  const { challanId = "No Data", previewData = {} } = data;
  
  // Make paginated items
  const items = previewData.items || [];
  const totalPages = Math.ceil(items?.length / ITEMS_PER_PAGE);

  // Get the company image path
  let companyImg = path.join(
    __dirname,
    `../uploads/companyImages/${previewData?.companyDetails?.imgURL}`
  );
  if (!fs.existsSync(companyImg)) {
    companyImg = path.join(__dirname, '../assets/images/default.png');
  }

  // Convert image into base 64
  const companyImgBase64 = imageToBase64(companyImg);

  const invoiceCompany = `<div class="invoice-company">
        <div class="invoice-company-image">
          <img src="${companyImgBase64}" alt="Company Logo" />
        </div>
        <div class="invoice-company-details flex-col-start">
          <h3>${previewData.companyDetails?.name?.toUpperCase() || ""}</h3>
          <h5>${previewData.companyDetails?.desc?.toUpperCase() || ""}</h5>
          <p>${previewData.companyDetails?.grades || ""}</p>
          <p>Works : ${previewData.companyDetails?.address1 || ""}</p>
          <p>REGD. OFF : ${previewData.companyDetails?.address2 || ""}</p>
          <span class="invoice-company-last">GSTIN : ${
            previewData.companyDetails?.gstNo || ""
          } • MSME : ${previewData.companyDetails?.msme || ""} CIN No. : ${
    previewData.companyDetails?.cinNo || ""
  }</span>
        </div>
      </div>`;

  const invoiceShipDetails = `<div class="flex-row-space-between">
          <div class="flex-col-start">
            <div class="transport-address flex-col-start">
              <span class="invoice-label">Bill To</span>
              <h4>${previewData.billDetails?.name?.toUpperCase() || ""}</h4>
              <p>${previewData.billDetails?.address1 || ""}</p>
              <p>${previewData.billDetails?.address2 || ""}</p>
              <p>Phone no: ${previewData.billDetails?.mobile || ""}</p>
              <p>GST no: ${previewData.billDetails?.gstNo || ""}</p>
            </div>
            <div class="transport-address flex-col-start">
              <span class="invoice-label">Ship To</span>
              <h4>${previewData.shipDetails?.name?.toUpperCase() || ""}</h4>
              <p>${previewData.shipDetails?.address1 || ""}</p>
              <p>${previewData.shipDetails?.address2 || ""}</p>
              <p>Phone no: ${previewData.shipDetails?.mobile || ""}</p>
              <p>GST no: ${previewData.shipDetails?.gstNo || ""}</p>
            </div>
          </div>
          <div class="flex-col-start">
            <div class="right-section">
              <span class="invoice-label">Date</span>
              <p style="margin: 0">${
                previewData.entryDate
                  ? moment(previewData.entryDate).format("DD/MM/YYYY")
                  : ""
              }</p>
            </div>
            <div class="right-section">
              <span class="invoice-label">Challan no.</span>
              <p style="margin: 0">${challanId}</p>
            </div>
            <div class="right-section">
              <span class="invoice-label">Broker</span>
              <p style="margin: 0">${previewData.brokerDetails?.name || ""}</p>
            </div>
            <div class="right-section">
              <span class="invoice-label">Transport Name</span>
              <p style="margin: 0">${previewData.transportName || ""}</p>
            </div>
            <div class="right-section">
              <span class="invoice-label">Description</span>
              <p style="margin: 0">${previewData.shipmentDesc || ""}</p>
            </div>
          </div>
      </div>`;

  const paymentDetails = `<div class="payment-details">
        <div class="flex-col-start">
          <h4>Payment details</h4>
          <div class="bank-details">
            <p><strong>Bank name:</strong> <span>${
              previewData.companyDetails?.paymentDetails?.bankName || ""
            }</span></p>
            <p><strong>Branch:</strong> <span>${
              previewData.companyDetails?.paymentDetails?.branch || ""
            }</span></p>
            <p><strong>IFS code:</strong> <span>${
              previewData.companyDetails?.paymentDetails?.ifsCode || ""
            }</span></p>
            <p><strong>Account:</strong> <span>${
              previewData.companyDetails?.paymentDetails?.accountNumber || ""
            }</span></p>
          </div>
        </div>
        <div class="flex-col-start" style="justify-content: space-between;">
          <h4>For ${previewData.companyDetails?.name || ""}</h4>
          <h4>Authorized Signatory</h4>
        </div>
      </div>
  
      <div class="term-details page-break">
        <h4>Terms & Conditions</h4>
        <p>Payment is due within 30 days</p>
        <p>Goods once sold will not be taken back</p>
        <p>Interest will be charged on overdue payments</p>
      </div>`;

  const itemsHTML = (pageNumber) =>
    (
      previewData?.items?.slice(
        pageNumber * ITEMS_PER_PAGE,
        pageNumber * ITEMS_PER_PAGE + ITEMS_PER_PAGE
      ) || []
    )
      .map(
        (item) => `
      <tr>
        <td>${item.unit || ""}</td>
        <td>${item.item || ""}</td>
        <td>${item.hsnCode || ""}</td>
        <td>${item.weight || ""}</td>
        <td>${item.rate || ""}</td>
        <td>${item.amount || ""}</td>
      </tr>
    `
      )
      .join("");

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>Invoice</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        font-size: 14px;
        color: #000;
        background: #fff;
        padding: 20px;
      }
      .invoice-container {
        max-width: 1000px;
        margin: 0 auto;
        padding: 20px;
        border: 1px solid #ddd;
      }
      .invoice-heading {
        width: 100%;
        text-align: center;
        font-weight: 600;
        text-decoration: underline;
        line-height: 20px;
        margin: 0;
      }
      .flex-row-space-between {
        display: flex;
        justify-content: space-between;
        gap: 0.5rem;
      }
      .flex-col-start {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
      }
      .invoice-company {
        display: flex;
        gap: 1.5rem;
        margin-block: 1.5rem;
      }
      .invoice-company-image {
        width: 8.5rem;
        height: 8.5rem;
      }
      .invoice-company-image img {
        max-width: 100%;
        max-height: 100%;
      }
      .invoice-company-details h3 {
        font-weight: 600;
        font-size: 1rem;
        margin: 0;
      }
      .invoice-company-details h5,
      .invoice-company-details p {
        font-weight: 400;
        font-size: 0.75rem;
        margin: 0;
      }

      .invoice-company-last{
        font-size: 0.7rem;
      }

      .invoice-details {
        padding: 1rem 1.5rem;
        border-radius: 0.75rem;
        border: 0.5px solid #e0e2e7;
      }
      .invoice-label {
        font-size: 0.75rem;
        font-weight: 400;
        color: #64748b;
        margin-block: 8px;
      }
      .transport-address h4,
      .transport-details-right p {
        font-weight: 500;
        font-size: 0.75rem;
        color: #1e293b;
        margin: 0;
      }
      .transport-address p {
        font-size: 0.75rem;
        font-weight: 400;
        color: #1e293b;
        margin: 0;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 1rem;
      }
      table th, table td {
        border: 1px solid #ccc;
        padding: 8px;
        text-align: center;
      }
      table th {
        background-color: #f3f4f6;
        font-weight: bold;
      }
      .payment-details {
        display: flex;
        justify-content: space-between;
        margin-top: 0.5rem;
      }
      .bank-details p,
      .bank-details span,
      .bank-details strong {
        font-size: 0.7rem;
      }
      .term-details {
        margin-block: 0.5rem;
      }
      .term-details h4 {
        font-size: 0.7rem;
        font-weight: 400;
      }
      .term-details p {
        font-size: 0.7rem;
        font-weight: 500;
        color: #6B7280;
      }
    .right-section{
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 0.25rem;
    }
    .right-section  p{
        margin-block: 2px
    }
     .page-break {
        page-break-after: always;
      }
    </style>
  </head>
  <body>
    ${Array.from({ length: totalPages }).map((_, pageNumber) => {
      return `
      <div class="invoice-container">
        <h4 h4 class="invoice-heading">DELIVERY CHALLAN - CUM - TRANSIT INVOICE</h4>
  
        ${invoiceCompany}
  
        <div class="invoice-details">
            ${invoiceShipDetails}
            <table>
            <thead>
                <tr>
                <th>Pcs/Bdls</th>
                <th>Item</th>
                <th>HSN Code</th>
                <th>Weight</th>
                <th>Rate</th>
                <th>Amount</th>
                </tr>
            </thead>
            <tbody>
                ${itemsHTML(pageNumber)}
            </tbody>
            </table>
  
            ${
              totalPages - 1 === pageNumber
                ? `<div class="flex-row-space-between">
            <p><strong>Total Weight:</strong> ${parseFloat(
              previewData.totalWeight || 0
            ).toFixed(2)} kg</p>
            <p><strong>Total Amount:</strong> ${parseFloat(
              previewData.totalAmount || 0
            ).toFixed(2)}/-</p>
            </div>`
                : ""
            }
        </div>
        ${paymentDetails}
    </div>`;
    })}
  </body>
  </html>
    `;
};

export default generateInvoiceHTML;
