import {
  Breadcrumb,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Steps,
} from "antd";
import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { PageHeader, PageSubHeader } from "../../../../component/Headers";
import { GoOrganization } from "react-icons/go";
import { FiBox } from "react-icons/fi";
import { TbListDetails } from "react-icons/tb";
import { useGetPartyRecordsAsOptionQuery } from "../../../../redux/api/user/partyRecordApiSlice";
import filterOption from "../../../../helpers/filterOption";
import { useGetAsOptionQuery } from "../../../../redux/api/user/optionsApiSlice";
import { useGetBrokersAsOptionQuery } from "../../../../redux/api/user/brokerApiSlice";
import CustomButton from "../../../../component/CustomButton";

const InwardForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const recordId = searchParams.get("recordId");
  const [step, setStep] = useState(0);
  const [shipmentData, setShipmentData] = useState({});
  const [singleItem, setSingleItem] = useState({});
  const [items, setItems] = useState([]);

  const { data: partyOptions, isLoading: isPartyOptionsLoading } =
    useGetPartyRecordsAsOptionQuery();
  const { data: branchOptions, isLoading: isBranchOptionsLoading } =
    useGetAsOptionQuery({ type: 1, sameAsLabel: true });
  const {
    data: materialTypeOptions,
    isLoading: isMaterialTypesOptionsLoading,
  } = useGetAsOptionQuery({ type: 2, sameAsLabel: true });
  const {
    data: materialClassOptions,
    isLoading: isMaterialClassOptionsLoading,
  } = useGetAsOptionQuery({ type: 3, sameAsLabel: true });
  const { data: gradeOptions, isLoading: isGradeOptionsLoading } =
    useGetAsOptionQuery({ type: 4, sameAsLabel: true });
  const { data: borkerOptions, isLoading: isBrokerOptionsLoading } =
    useGetBrokersAsOptionQuery({ sameAsLabel: true });

  const handleShipmentSubmit = () => {
    setStep((prev) => prev + 1);
  };

  return (
    <section className="flex-col-start">
      <div>
        <Breadcrumb
          separator=">"
          items={[
            {
              title: <Link to="/home/inward">Inward Material</Link>,
            },
            {
              title: recordId ? "Update Inward Entry" : "Add Inward Entry",
            },
          ]}
        />
        <div className="margin-top">
          <PageHeader>
            {recordId ? "Update Inward Entry" : "Add Inward Entry"}
          </PageHeader>
          <PageSubHeader>
            Record new stock received and update inventory seamlessly
          </PageSubHeader>
        </div>
      </div>

      <div className="form-section">
        <div className="flex-row-space-between">
          <div className="steps-right-section">
            {step === 0 && (
              <>
                <h3 className="form-heading">Shipment Details</h3>
                <Form
                  className="full-width form-layout"
                  layout="vertical"
                  // disabled={isOTPsending}
                >
                  <Row gutter={[16]}>
                    <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                      <Form.Item label="Date">
                        <DatePicker
                          format="DD/MM/YYYY"
                          style={{ width: "100%" }}
                          size="large"
                          name="entryDate"
                          value={shipmentData?.entryDate}
                          onChange={(date, dateString) =>
                            setShipmentData((prev) => ({
                              ...prev,
                              entryDate: date,
                            }))
                          }
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                      <Form.Item label="Invoice No.">
                        <Input
                          size="large"
                          name="invoiceNo"
                          value={shipmentData?.invoiceNo}
                          onChange={(e) =>
                            setShipmentData((prev) => ({
                              ...prev,
                              invoiceNo: e?.target?.value,
                            }))
                          }
                          placeholder="PKHT/01"
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                      <Form.Item label="Branch">
                        <Select
                          name="branch"
                          size="large"
                          style={{ width: "100%" }}
                          showSearch
                          placeholder="Select a branch"
                          optionFilterProp="children"
                          filterOption={filterOption}
                          options={branchOptions}
                          disabled={isBranchOptionsLoading}
                          value={shipmentData?.branch}
                          onChange={(value) =>
                            setShipmentData((prev) => ({
                              ...prev,
                              branch: value,
                            }))
                          }
                          allowClear
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                      <Form.Item label="Type">
                        <Select
                          name="materialType"
                          size="large"
                          style={{ width: "100%" }}
                          showSearch
                          placeholder="Select a type"
                          optionFilterProp="children"
                          filterOption={filterOption}
                          options={materialTypeOptions}
                          disabled={isMaterialTypesOptionsLoading}
                          value={shipmentData?.materialType}
                          onChange={(value) =>
                            setShipmentData((prev) => ({
                              ...prev,
                              materialType: value,
                            }))
                          }
                          allowClear
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                      <Form.Item label="Company">
                        <Select
                          name="company"
                          size="large"
                          style={{ width: "100%" }}
                          showSearch
                          placeholder="Select a company"
                          optionFilterProp="children"
                          filterOption={filterOption}
                          options={partyOptions}
                          disabled={isPartyOptionsLoading}
                          value={shipmentData?.company}
                          onChange={(value) =>
                            setShipmentData((prev) => ({
                              ...prev,
                              company: value,
                            }))
                          }
                          allowClear
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                      <Form.Item label="Broker">
                        <Select
                          name="broker"
                          size="large"
                          style={{ width: "100%" }}
                          showSearch
                          placeholder="Select a broker"
                          optionFilterProp="children"
                          filterOption={filterOption}
                          options={borkerOptions}
                          disabled={isBrokerOptionsLoading}
                          value={shipmentData?.broker}
                          onChange={(value) =>
                            setShipmentData((prev) => ({
                              ...prev,
                              broker: value,
                            }))
                          }
                          allowClear
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                      <Form.Item label="Transport Name">
                        <Input
                          size="large"
                          name="transportName"
                          value={shipmentData?.transportName}
                          onChange={(e) =>
                            setShipmentData((prev) => ({
                              ...prev,
                              transportName: e?.target?.value,
                            }))
                          }
                          placeholder=""
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                      <Form.Item label="Vehicle No.">
                        <Input
                          size="large"
                          name="vehicleNo"
                          value={shipmentData?.vehicleNo}
                          onChange={(e) =>
                            setShipmentData((prev) => ({
                              ...prev,
                              vehicleNo: e?.target?.value,
                            }))
                          }
                          placeholder=""
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                      <Form.Item>
                        <CustomButton
                          width={150}
                          size="large"
                          onClick={handleShipmentSubmit}
                        >
                          Save
                        </CustomButton>
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </>
            )}

            {step === 1 && (
              <>
                <h3 className="form-heading">Shipment Details</h3>
                <Form
                  className="full-width form-layout"
                  layout="vertical"
                  // disabled={isOTPsending}
                >
                  <Row gutter={[16]}>
                    <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                      <Form.Item label="Material Class">
                        <Select
                          name="materialClass"
                          size="large"
                          style={{ width: "100%" }}
                          showSearch
                          placeholder="Select a material class"
                          optionFilterProp="children"
                          filterOption={filterOption}
                          options={materialClassOptions}
                          disabled={isMaterialClassOptionsLoading}
                          value={singleItem?.materialClass}
                          onChange={(value) =>
                            setSingleItem((prev) => ({
                              ...prev,
                              materialClass: value,
                            }))
                          }
                          allowClear
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                      <Form.Item label="HSN Code">
                        <Input
                          size="large"
                          name="HSNCode"
                          value={singleItem?.HSNCode}
                          onChange={(e) =>
                            setSingleItem((prev) => ({
                              ...prev,
                              HSNCode: e?.target?.value,
                            }))
                          }
                          placeholder="72155090"
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                      <Form.Item label="Grade">
                        <Select
                          name="grade"
                          size="large"
                          style={{ width: "100%" }}
                          showSearch
                          placeholder="Select a grade"
                          optionFilterProp="children"
                          filterOption={filterOption}
                          options={gradeOptions}
                          disabled={isGradeOptionsLoading}
                          value={singleItem?.grade}
                          onChange={(value) =>
                            setSingleItem((prev) => ({
                              ...prev,
                              grade: value,
                            }))
                          }
                          allowClear
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                      <Form.Item label="Size">
                        <InputNumber
                          size="large"
                          name="size"
                          value={singleItem?.size}
                          onChange={(e) =>
                            setSingleItem((prev) => ({
                              ...prev,
                              size: e?.target?.value,
                            }))
                          }
                          style={{ width: "100%" }}
                          placeholder="mm"
                          min={0}
                          step={0.01}
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                      <Form.Item label="Company">
                        <Select
                          name="company"
                          size="large"
                          style={{ width: "100%" }}
                          showSearch
                          placeholder="Select a company"
                          optionFilterProp="children"
                          filterOption={filterOption}
                          options={partyOptions}
                          disabled={isPartyOptionsLoading}
                          value={shipmentData?.company}
                          onChange={(value) =>
                            setShipmentData((prev) => ({
                              ...prev,
                              company: value,
                            }))
                          }
                          allowClear
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                      <Form.Item label="Broker">
                        <Select
                          name="broker"
                          size="large"
                          style={{ width: "100%" }}
                          showSearch
                          placeholder="Select a broker"
                          optionFilterProp="children"
                          filterOption={filterOption}
                          options={borkerOptions}
                          disabled={isBrokerOptionsLoading}
                          value={shipmentData?.broker}
                          onChange={(value) =>
                            setShipmentData((prev) => ({
                              ...prev,
                              broker: value,
                            }))
                          }
                          allowClear
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                      <Form.Item label="Transport Name">
                        <Input
                          size="large"
                          name="transportName"
                          value={shipmentData?.transportName}
                          onChange={(e) =>
                            setShipmentData((prev) => ({
                              ...prev,
                              transportName: e?.target?.value,
                            }))
                          }
                          placeholder=""
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                      <Form.Item label="Vehicle No.">
                        <Input
                          size="large"
                          name="vehicleNo"
                          value={shipmentData?.vehicleNo}
                          onChange={(e) =>
                            setShipmentData((prev) => ({
                              ...prev,
                              vehicleNo: e?.target?.value,
                            }))
                          }
                          placeholder=""
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                      <Form.Item>
                        <CustomButton
                          width={150}
                          size="large"
                          onClick={handleShipmentSubmit}
                        >
                          Save
                        </CustomButton>
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </>
            )}

            {step === 2 && <h1>Step 3</h1>}
          </div>
          <div className="steps-left-section">
            <Steps direction="vertical" current={step} className="steps-block">
              <Steps.Step title="Shipment Details" icon={<GoOrganization />} />
              <Steps.Step title="Item Details" icon={<FiBox />} />
              <Steps.Step title="Summary" icon={<TbListDetails />} />
            </Steps>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InwardForm;
