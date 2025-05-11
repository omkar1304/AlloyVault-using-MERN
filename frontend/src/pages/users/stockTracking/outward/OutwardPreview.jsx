import React, { useEffect, useRef, useState } from "react";
import "../../../../assets/css/preview.css";
import moment from "moment";
import { PageHeader, PageSubHeader } from "../../../../component/Headers";
import { Breadcrumb } from "antd";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import CustomButton from "../../../../component/CustomButton";
import Dummy from "../../../../assets/images/logo/dummy.svg";
import html2pdf from "html2pdf.js";
import html2canvas from "html2canvas";
import CustomTable from "./../../../../component/CustomTable";
import decryptString from "../../../../helpers/decryptString";
import { useGetDetailsForPreviewQuery } from "../../../../redux/api/user/stockEntryApiSlice";
import { BASE_URL } from "../../../../redux/constant";

const columns = [
  {
    title: "Pcs/Bdls",
    dataIndex: "unit",
    width: 80,
    render: (x) => x,
  },
  {
    title: "Item",
    dataIndex: "item",
    width: 200,
    render: (x) => x,
  },
  {
    title: "HSN Code",
    dataIndex: "hsnCode",
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
  const [searchParams] = useSearchParams();
  const challanId = decryptString(searchParams.get("challan"));

  const { data: previewData, isLoading: isDetailsLoading } =
    useGetDetailsForPreviewQuery({ challanId }, { skip: !challanId });

  const companyImgURL = previewData?.companyDetails?.imgURL
    ? `${BASE_URL}/uploads/companyImages/${previewData?.companyDetails?.imgURL}`
    : Dummy;

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

        <div className="flex-row-start invoice-company">
          <div className="invoice-company-image">
            <img src={companyImgURL} alt="Company Logo" />
          </div>
          <div className="flex-col-start invoice-company-details">
            <h3>{previewData?.companyDetails?.name?.toUpperCase() ?? ""}</h3>
            <h5>{previewData?.companyDetails?.desc?.toUpperCase() ?? ""}</h5>
            <p>{previewData?.companyDetails?.grades ?? ""}</p>
            <p>{`Works : ${previewData?.companyDetails?.address1 ?? ""}`}</p>
            <p>
              {`REGD. OFF : ${previewData?.companyDetails?.address2 ?? ""}`}
            </p>
            <h5>
              {`GSTIN : ${previewData?.companyDetails?.gstNo ?? ""} • MSME : ${
                previewData?.companyDetails?.msme ?? ""
              } CIN No. :
              ${previewData?.companyDetails?.cinNo ?? ""}`}
            </h5>
          </div>
        </div>

        <div className="invoice-details">
          <div className="flex-row-space-between transport-details">
            <div className="flex-col-start transport-details-left">
              <div className="flex-col-start transport-address">
                <span className="invoice-label">Bill To</span>
                <h4>{previewData?.billDetails?.name?.toUpperCase() ?? ""}</h4>
                <p>{previewData?.billDetails?.address1 ?? ""}</p>
                <p>{previewData?.billDetails?.address2 ?? ""}</p>
                <p>{`Phone no: ${previewData?.billDetails?.mobile ?? ""}`}</p>
                <p>{`GST no: ${previewData?.billDetails?.gstNo ?? ""}`}</p>
              </div>
              <div className="flex-col-start transport-address">
                <span className="invoice-label">Ship To</span>
                <h4>{previewData?.shipDetails?.name?.toUpperCase() ?? ""}</h4>
                <p>{previewData?.shipDetails?.address1 ?? ""}</p>
                <p>{previewData?.shipDetails?.address2 ?? ""}</p>
                <p>{`Phone no: ${previewData?.shipDetails?.mobile ?? ""}`}</p>
                <p>{`GST no: ${previewData?.shipDetails?.gstNo ?? ""}`}</p>
              </div>
            </div>
            <div className="flex-col-start transport-details-right">
              <div>
                <span className="invoice-label">Date</span>
                <p>
                  {previewData?.entryDate
                    ? moment(previewData?.entryDate).format("DD/MM/YYYY")
                    : ""}
                </p>
              </div>

              <div>
                <span className="invoice-label">Challan no.</span>
                <p>{challanId}</p>
              </div>
              <div>
                <span className="invoice-label">Broker</span>
                <p>{previewData?.brokerDetails?.name ?? ""}</p>
              </div>
              <div>
                <span className="invoice-label">Transport Name</span>
                <p>{previewData?.transportName ?? ""}</p>
              </div>
              <div>
                <span className="invoice-label">Description</span>
                <p>{previewData?.shipmentDesc ?? ""}</p>
              </div>
            </div>
          </div>
          <br />
          <CustomTable
            data={previewData?.items || []}
            columns={columns}
            isPaginationAllowed={false}
            scrollAllwoed={false}
          />
          <br />
          <div className="flex-row-space-between">
            <p className="flex-row-space-between">
              <strong>Total Weight</strong>
              <span>
                {parseFloat(previewData?.totalWeight || 0).toFixed(2)} kg
              </span>
            </p>
            <p className="flex-row-space-between">
              <strong>Total Amount</strong>
              <span>
                {parseFloat(previewData?.totalAmount || 0).toFixed(2)}/-
              </span>
            </p>
          </div>
        </div>

        <div className="flex-row-space-between payment-details">
          <div className="flex-col-start payment-details-left">
            <h4>Payment details</h4>
            <div className="flex-col-start bank-details">
              <p className="flex-row-space-between">
                <strong>Bank name</strong>
                <span>
                  {previewData?.companyDetails?.paymentDetails?.bankName || ""}
                </span>
              </p>
              <p className="flex-row-space-between">
                <strong>Branch</strong>
                <span>
                  {previewData?.companyDetails?.paymentDetails?.branch || ""}
                </span>
              </p>
              <p className="flex-row-space-between">
                <strong>IFS code</strong>
                <span>
                  {previewData?.companyDetails?.paymentDetails?.ifsCode || ""}
                </span>
              </p>
              <p className="flex-row-space-between">
                <strong>Account</strong>
                <span>
                  {previewData?.companyDetails?.paymentDetails?.accountNumber ||
                    ""}
                </span>
              </p>
            </div>
          </div>
          <div className="flex-col-space-between payment-details-right">
            <h4>{`For ${previewData?.companyDetails?.name ?? ""}`}</h4>
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
