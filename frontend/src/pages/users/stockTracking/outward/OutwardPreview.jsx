import React, { useRef } from "react";
import "../../../../assets/css/preview.css";
import { PageHeader, PageSubHeader } from "../../../../component/Headers";
import { Breadcrumb } from "antd";
import { Link } from "react-router-dom";
import CustomButton from "../../../../component/CustomButton";
import LOGO from "../../../../assets/images/logo/company.svg";
import html2pdf from "html2pdf.js";
import html2canvas from "html2canvas";

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
              title: "Outward Preview",
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
      <div className="flex-row-end full-width">
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
        <div className="header">
          <div className="logo-section">
            <img src={LOGO} alt="Logo" className="logo" />
            <div>
              <h2>Pranav Bright Bars Pvt Ltd</h2>
              <p>
                Plot No. 31, Ram House, Liza Palace, 4, Sum, West Garo Hills,
                <br />
                Meghalaya, Pincode-794103
                <br />
                848172948 | contact@pbbltd.se
                <br />
                GSTIN: 27AAACU0983R1ZV
                <br />
                CIN: 27AAACU0983R1ZV
              </p>
            </div>
          </div>
          <div className="invoice-number">
            <strong>Challan No.</strong>
            <br />
            NKHT/001
          </div>
        </div>

        <div className="details-section">
          <div className="info-block">
            <p>
              <strong>Bill Date</strong>
              <br />
              03/05/2020
            </p>
            <p>
              <strong>Broker</strong>
              <br />
              Mithil Phool
            </p>
            <p>
              <strong>Terms of Payment</strong>
              <br />
              Within 15 days
            </p>
            <p>
              <strong>Transport Name</strong>
              <br />
              ABC Transport
            </p>
          </div>
          <div className="address-block">
            <div>
              <p>
                <strong>Billing Address</strong>
                <br />
                Willy Wonka
                <br />
                1445 West Norwood Avenue, Itasca, Illinois, USA
                <br />
                9722300415 | gm@om.com
                <br />
                GSTIN: 27AAACU0983R1ZV
              </p>
            </div>
            <div>
              <p>
                <strong>Consignee Address</strong>
                <br />
                Willy Wonka
                <br />
                1445 West Norwood Avenue, Itasca, Illinois, USA
                <br />
                9722300415 | gm@om.com
                <br />
                GSTIN: 27AAACU0983R1ZV
              </p>
            </div>
          </div>
        </div>

        <table className="item-table">
          <thead>
            <tr>
              <th>No.</th>
              <th>Item</th>
              <th>HSN</th>
              <th>Quantity</th>
              <th>Rate</th>
              <th>Final Amount</th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3].map((num) => (
              <tr key={num}>
                <td>{num}</td>
                <td>
                  EN1A NL 11 DIA
                  <br />5 BOLS
                </td>
                <td>72155090</td>
                <td>258.8 kg</td>
                <td>-</td>
                <td>-</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="footer">
          <p>
            <strong>Total Price</strong>
          </p>
          <div className="payment-info">
            <div>
              <p>
                <strong>Payment details</strong>
              </p>
              <p>
                Bank name: ABCD BANK
                <br />
                Branch: ABCDXXXXXXX
                <br />
                IFSC code: ABCD000XXX
                <br />
                Account: 37440812300011
              </p>
            </div>
            <div className="auth-sign">
              <p>For Pranav Bright Bars Pvt Ltd</p>
              <p>
                <strong>Authorized Signatory</strong>
              </p>
            </div>
          </div>
          <div className="terms">
            <p>
              <strong>Terms & Conditions</strong>
              <br />
              Payment is due within 30 days
              <br />
              Goods once sold will not be taken back
              <br />
              Interest will be charged on overdue payments
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OutwardPreview;
