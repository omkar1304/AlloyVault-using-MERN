import React, { useRef } from "react";
import "../../../../assets/css/preview.css";
import { PageHeader, PageSubHeader } from "../../../../component/Headers";
import { Breadcrumb } from "antd";
import { Link } from "react-router-dom";
import CustomButton from "../../../../component/CustomButton";
import Dummy from "../../../../assets/images/logo/dummy.svg";
import html2pdf from "html2pdf.js";
import html2canvas from "html2canvas";
import CustomTable from "./../../../../component/CustomTable";

const data = [
  {
    unit: "15 bdls/55 nos",
    item: "EN1A (NL) 11mm Dia",
    HSNCode: "72155090",
    weight: "200.00 kg",
    rate: "78/-",
    amount: "15600/-",
  },
  {
    unit: "15 bdls/55 nos",
    item: "EN1A (NL) 11mm Dia",
    HSNCode: "72155090",
    weight: "200.00 kg",
    rate: "78/-",
    amount: "15600/-",
  },
  {
    unit: "15 bdls/55 nos",
    item: "EN1A (NL) 11mm Dia",
    HSNCode: "72155090",
    weight: "200.00 kg",
    rate: "78/-",
    amount: "15600/-",
  },

  {
    unit: "15 bdls/55 nos",
    item: "EN1A (NL) 11mm Dia",
    HSNCode: "72155090",
    weight: "200.00 kg",
    rate: "78/-",
    amount: "15600/-",
  },
  {
    unit: "15 bdls/55 nos",
    item: "EN1A (NL) 11mm Dia",
    HSNCode: "72155090",
    weight: "200.00 kg",
    rate: "78/-",
    amount: "15600/-",
  },
];

const columns = [
  {
    title: "Pcs/Bdls",
    dataIndex: "unit",
    width: 150,
    render: (x) => x,
  },
  {
    title: "Item",
    dataIndex: "item",
    width: 150,
    render: (x) => x,
  },
  {
    title: "HSN Code",
    dataIndex: "HSNCode",
    width: 100,
    render: (x) => x,
  },
  {
    title: "Weight",
    dataIndex: "weight",
    width: 100,
    render: (x) => x,
  },
  {
    title: "Rate",
    dataIndex: "rate",
    width: 60,
    render: (x) => x,
  },
  {
    title: "Amount",
    dataIndex: "amount",
    width: 100,
    render: (x) => x,
  },
];

const OutwardPreview = () => {
  const invoiceRef = useRef();

  const handleDownload = () => {
    const element = invoiceRef.current;

    const options = {
      margin: 0.5,
      filename: "invoice.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    html2pdf().set(options).from(element).save();
  };

  const handlePrint = async () => {
    const element = invoiceRef.current;

    const canvas = await html2canvas(element, { scale: 2 });
    const imageData = canvas.toDataURL("image/png");

    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
    <html>
      <head>
        <title>Print Invoice</title>
        <style>
          body {
            margin: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
          }
          img {
            max-width: 100%;
            height: auto;
          }
        </style>
      </head>
      <body>
        <img id="invoice-img" src="${imageData}" />
        <script>
          const img = document.getElementById('invoice-img');
          img.onload = function () {
            window.focus();
            window.print();
            window.onafterprint = function () {
              window.close();
            };
          };
        </script>
      </body>
    </html>
  `);
    printWindow.document.close();
  };

  return (
    <section className="flex-col-start">
      <div>
        <Breadcrumb
          separator=">"
          items={[
            {
              title: <Link to="/home/outward">Outward Material</Link>,
            },
            {
              title: "Preview",
            },
          ]}
        />
        <div className="margin-top">
          <PageHeader>Preview</PageHeader>
          <PageSubHeader>
            See preview and download it efficiently.
          </PageSubHeader>
        </div>
      </div>
      <div className="flex-row-center full-width">
        <CustomButton width={150} size="large" onClick={handlePrint}>
          Print
        </CustomButton>
        <CustomButton
          width={150}
          size="large"
          type="Secondary"
          onClick={handleDownload}
        >
          Download
        </CustomButton>
      </div>

      <div className="invoice-container" ref={invoiceRef}>
        <h4 className="invoice-heading">
          DELIVERY CHALLAN - CUM - TRANSIT INVOICE
        </h4>

        <div className="flex-row-space-between invoice-company">
          <div className="invoice-company-image">
            <img src={Dummy} alt="Company Logo" />
          </div>
          <div className="flex-col-start invoice-company-details">
            <h3>PRANAV BRIGHT BARS PRIVATE LIMITED</h3>
            <h5>MANUFACTURER & SUPPLIERS</h5>
            <p>
              Bright Bars in EN-Series like EN-8/9/19/24/31/353 SAE8620 & Spring
              Wires, M.S. Wire, Free Cutting Steels etc.
            </p>
            <p>
              Works : Plot No. 27, Amgaon Industrial Area, Tal. Talasari, Dist.
              Palghar, Maharashtra - 401 606.
            </p>
            <p>
              REGD. OFF : 90, Ardeshir Dadi Street, 1st Floor, Mumbai,
              Maharashtra - 400 004. Tel.: 022 2396 9594 Email :
              pranavbrightbars@gmail.com
            </p>
            <h5>
              GSTIN : 27AADCP1678H1Z3 • MSME : UDYAM - MH19 - 0263589 CIN No. :
              U51420MH2003PTC143744{" "}
            </h5>
          </div>
        </div>

        <div className="invoice-details">
          <div className="flex-row-space-between transport-details">
            <div className="flex-col-start transport-details-left">
              <div className="flex-col-start transport-address">
                <span className="invoice-label">Bill To</span>
                <h4>Gringotts Steelworks</h4>
                <p>The Enchanted Yard,No. 13 Grindsteel Lane,</p>
                <p>Knockturn Docks,London, Wizarding District 9</p>
                <p>Phone no: 777777777777</p>
                <p>GST no: 07HOG394MUGWZ</p>
              </div>
              <div className="flex-col-start transport-address">
                <span className="invoice-label">Ship To</span>
                <h4>Gringotts Steelworks</h4>
                <p>The Enchanted Yard,No. 13 Grindsteel Lane,</p>
                <p>Knockturn Docks,London, Wizarding District 9</p>
                <p>Phone no: 777777777777</p>
                <p>GST no: 07HOG394MUGWZ</p>
              </div>
            </div>
            <div className="flex-col-start transport-details-right">
              <div>
                <span className="invoice-label">Date</span>
                <p>01/01/2025</p>
              </div>

              <div>
                <span className="invoice-label">Challan no.</span>
                <p>KHT/25-26/0001</p>
              </div>
              <div>
                <span className="invoice-label">Broker</span>
                <p>Ron Weasley</p>
              </div>
              <div>
                <span className="invoice-label">Transport Name</span>
                <p>Nimbus Freights</p>
              </div>
              <div>
                <span className="invoice-label">Description</span>
                <p>Payment term - 30 Days</p>
              </div>
            </div>
          </div>
          <br />
          <CustomTable
            data={data}
            columns={columns}
            isPaginationAllowed={false}
            scrollAllwoed={false}
          />
        </div>

        <div className="flex-row-space-between payment-details">
          <div className="flex-col-start payment-details-left">
            <h4>Payment details</h4>
            <div className="flex-col-start bank-details">
              <p className="flex-row-space-between">
                <strong>Bank name</strong>
                <span>Union Bank of India</span>
              </p>
              <p className="flex-row-space-between">
                <strong>Branch</strong>
                <span>Bhuleshwar, Mumbai - 400 004</span>
              </p>
              <p className="flex-row-space-between">
                <strong>IFS code</strong>
                <span>00000000000000</span>
              </p>
              <p className="flex-row-space-between">
                <strong>Account</strong>
                <span>UBIN0531600</span>
              </p>
            </div>
          </div>
          <div className="flex-col-space-between payment-details-right">
            <h4>For Pranav Bright Bars Pvt Ltd</h4>
            <h4>Authorized Signatory</h4>
          </div>
        </div>

        <div className="flex-col-start term-details">
          <h4>Terms & Conditions</h4>
          <p>Payment is due within 30 days</p>
          <p>Goods once sold will not be taken back</p>
          <p>Interest will be charged on overdue payments</p>
        </div>
      </div>
    </section>
  );
};

export default OutwardPreview;
