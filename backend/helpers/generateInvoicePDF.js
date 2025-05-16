import puppeteer from "puppeteer";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import generateInvoiceHTML from "../templates/invoiceTemplate.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const generateInvoicePDF = async (data, fileName) => {
  try {
    const safeFileName = fileName.endsWith(".pdf")
      ? fileName
      : `${fileName}.pdf`;
    const html = generateInvoiceHTML(data);
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "load" });
    const outputPath = path.join(__dirname, `../uploads/invoices`);
    if (!fs.existsSync(outputPath)) {
      fs.mkdirSync(outputPath, { recursive: true });
    }

    const fullPath = path.join(outputPath, safeFileName);
    await page.pdf({
      path: fullPath,
      format: "A4",
      printBackground: true,
    });
    await browser.close();
    console.log("Invoice generated successfully!");
    return safeFileName;
  } catch (error) {
    console.log("Error in generating invoide PDF", error);
  }
};

export default generateInvoicePDF;
