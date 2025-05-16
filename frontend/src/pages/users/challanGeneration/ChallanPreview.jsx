
import { Breadcrumb } from "antd";
import { Link, useSearchParams } from "react-router-dom";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import { PageHeader, PageSubHeader } from "../../../component/Headers";
import { BASE_URL } from "../../../redux/constant";
import decryptString from './../../../helpers/decryptString';
import getSafeInvoiceFileName from './../../../../../backend/helpers/getSafeInvoiceFileName';

const ChallanPreview = () => {
  const [searchParams] = useSearchParams();
  const challanId = decryptString(searchParams.get("challan"));

  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const fileUrl = `${BASE_URL}/uploads/invoices/${getSafeInvoiceFileName(
    challanId
  )}.pdf`;

  return (
    <section className="full-width">
      <div>
        <Breadcrumb
          separator=">"
          items={[
            {
              title: <Link to="/home/challanGeneration">Challan List</Link>,
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

      <div style={{ height: "750px", marginBlock: "1rem" }}>
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
          <Viewer fileUrl={fileUrl} plugins={[defaultLayoutPluginInstance]} />
        </Worker>
      </div>
    </section>
  );
};

export default ChallanPreview;
