import {
  Breadcrumb,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Radio,
  Row,
  Select,
  Steps,
} from "antd";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { PageHeader, PageSubHeader } from "../../../../component/Headers";
import { GoOrganization } from "react-icons/go";
import { TbListDetails } from "react-icons/tb";
import { BsBoxSeam } from "react-icons/bs";
import {
  useGetPartyDetailsQuery,
  useGetPartyRecordsAsOptionQuery,
} from "../../../../redux/api/user/partyRecordApiSlice";
import filterOption from "../../../../helpers/filterOption";
import { useGetAsOptionQuery } from "../../../../redux/api/user/optionsApiSlice";
import { useGetBrokersAsOptionQuery } from "../../../../redux/api/user/brokerApiSlice";
import CustomButton from "../../../../component/CustomButton";
import { shapeOptions } from "../../../../component/FormOptions";
import CustomTable from "../../../../component/CustomTable";
import getItemColumns from "./getItemColumns";
import toast from "react-hot-toast";
import getFormattedDate from "../../../../helpers/getFormattedDate";
import {
  useAddStockEntryMutation,
  useGetStockEntryDetailsQuery,
  useUpdateStockEntryMutation,
} from "../../../../redux/api/user/stockEntryApiSlice";
import dayjs from "dayjs";

const InwardForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const recordId = searchParams.get("recordId");
  const [step, setStep] = useState(0);
  const [shipmentData, setShipmentData] = useState({});
  const [items, setItems] = useState([]);
  const [shipmentForm] = Form.useForm();
  const [itemForm] = Form.useForm();

  const { data: stockEntryDetails, refetch: fetchStockEntryDetails } =
    useGetStockEntryDetailsQuery({ recordId }, { skip: !recordId });
  const { data: partyDetails } = useGetPartyDetailsQuery(
    { searchBy: "name", partyName: shipmentData?.company },
    { skip: !shipmentData?.company } // Skip till we reach last page
  );
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
  const [addStockEntry, { isLoading: isStockEntrtyAdding }] =
    useAddStockEntryMutation();
  const [updateStockEntry, { isLoading: isStockEntrtyUpdating }] =
    useUpdateStockEntryMutation();

  useEffect(() => {
    if (recordId) {
      fetchStockEntryDetails();
    }
  }, [recordId]);

  useEffect(() => {
    if (stockEntryDetails) {
      shipmentForm.setFieldsValue({
        ...stockEntryDetails,
        entryDate: dayjs(stockEntryDetails?.entryDate || null),
      });
      itemForm.setFieldsValue(stockEntryDetails);
    }
  }, [stockEntryDetails]);

  const handleShipmentSubmit = (values) => {
    setShipmentData(values);
    setStep((prev) => prev + 1);
  };

  const handleItemSubmit = () => {
    if (!items.length) {
      toast.error("Please add at least one item to proceed!");
      return;
    }

    setStep((prev) => prev + 1);
  };

  const handleAddItem = (item) => {
    setItems((prevItems) => {
      return [{ ...item, uniqueKey: Date.now() }, ...prevItems];
    });

    // If update, then move to next stage
    if (recordId) {
      setStep((prev) => prev + 1);
    }
    // if add, just reset for new item to add
    else {
      itemForm.resetFields();
    }
  };

  const handleRemoveItem = (uniqueKey) => {
    const filteredItems = items?.filter((item) => item.uniqueKey !== uniqueKey);
    setItems(filteredItems);
  };

  const handleResetStep = () => {
    setStep(0);
  };

  const handleAddStock = async () => {
    try {
      await addStockEntry({ shipmentData, items, type: "Inward" }).unwrap();
      toast.success("Record added successfully!");
    } catch (error) {
      console.error(error);
      const errMessage = error?.data?.message || "Couldn't add record!";
      toast.error(errMessage);
    }
    navigate(`/home/inward`);
  };

  const handleUpdateStock = async () => {
    try {
      await updateStockEntry({
        recordId,
        ...shipmentData,
        ...items[0],
      }).unwrap();
      toast.success("Record updated successfully!");
    } catch (error) {
      console.error(error);
      const errMessage = error?.data?.message || "Couldn't update record!";
      toast.error(errMessage);
    }
    navigate(`/home/inward`);
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
                  form={shipmentForm}
                  onFinish={handleShipmentSubmit}
                  // disabled={isOTPsending}
                >
                  <Row gutter={[16]}>
                    <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                      <Form.Item
                        label="Date"
                        name="entryDate"
                        rules={[
                          { required: true, message: "Please select a date" },
                        ]}
                      >
                        <DatePicker
                          format="DD/MM/YYYY"
                          style={{ width: "100%" }}
                          size="large"
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                      <Form.Item label="Invoice No." name="invoiceNo">
                        <Input size="large" placeholder="PKHT/01" />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                      <Form.Item
                        label="Branch"
                        name="branch"
                        rules={[
                          { required: true, message: "Please select a branch" },
                        ]}
                      >
                        <Select
                          size="large"
                          style={{ width: "100%" }}
                          showSearch
                          placeholder="Select a branch"
                          optionFilterProp="children"
                          filterOption={filterOption}
                          options={branchOptions}
                          disabled={isBranchOptionsLoading}
                          allowClear
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                      <Form.Item
                        label="Type"
                        name="materialType"
                        rules={[
                          {
                            required: true,
                            message: "Please select a material type",
                          },
                        ]}
                      >
                        <Select
                          size="large"
                          style={{ width: "100%" }}
                          showSearch
                          placeholder="Select a type"
                          optionFilterProp="children"
                          filterOption={filterOption}
                          options={materialTypeOptions}
                          disabled={isMaterialTypesOptionsLoading}
                          allowClear
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                      <Form.Item
                        label="Company"
                        name="company"
                        rules={[
                          {
                            required: true,
                            message: "Please select a company",
                          },
                        ]}
                      >
                        <Select
                          size="large"
                          style={{ width: "100%" }}
                          showSearch
                          placeholder="Select a company"
                          optionFilterProp="children"
                          filterOption={filterOption}
                          options={partyOptions}
                          disabled={isPartyOptionsLoading}
                          allowClear
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                      <Form.Item
                        label="Broker"
                        name="broker"
                        rules={[
                          {
                            required: true,
                            message: "Please select a broker",
                          },
                        ]}
                      >
                        <Select
                          size="large"
                          style={{ width: "100%" }}
                          showSearch
                          placeholder="Select a broker"
                          optionFilterProp="children"
                          filterOption={filterOption}
                          options={borkerOptions}
                          disabled={isBrokerOptionsLoading}
                          allowClear
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                      <Form.Item
                        label="Transport Name"
                        name="transportName"
                        rules={[
                          {
                            required: true,
                            message: "Please enter transport name",
                          },
                        ]}
                      >
                        <Input
                          size="large"
                          value={shipmentData?.transportName}
                          placeholder=""
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                      <Form.Item
                        label="Vehicle No."
                        name="vehicleNo"
                        rules={[
                          {
                            required: true,
                            message: "Please enter vehicle no",
                          },
                        ]}
                      >
                        <Input
                          size="large"
                          value={shipmentData?.vehicleNo}
                          placeholder=""
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                      <Form.Item>
                        <CustomButton
                          width={150}
                          size="large"
                          htmlType="submit"
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
                  form={itemForm}
                  onFinish={handleAddItem}
                  // disabled={isOTPsending}
                >
                  <Row gutter={[16]}>
                    <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                      <Form.Item
                        name="materialClass"
                        label="Material Class"
                        rules={[
                          {
                            required: true,
                            message: "Please select a material class",
                          },
                        ]}
                      >
                        <Select
                          size="large"
                          style={{ width: "100%" }}
                          showSearch
                          placeholder="Select a material class"
                          optionFilterProp="children"
                          filterOption={filterOption}
                          options={materialClassOptions}
                          disabled={isMaterialClassOptionsLoading}
                          allowClear
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                      <Form.Item
                        label="Grade"
                        name="grade"
                        rules={[
                          {
                            required: true,
                            message: "Please select a grade",
                          },
                        ]}
                      >
                        <Select
                          size="large"
                          style={{ width: "100%" }}
                          showSearch
                          placeholder="Select a grade"
                          optionFilterProp="children"
                          filterOption={filterOption}
                          options={gradeOptions}
                          disabled={isGradeOptionsLoading}
                          allowClear
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                      <Form.Item
                        label="Size"
                        name="size"
                        rules={[
                          {
                            required: true,
                            message: "Please enter a size",
                          },
                        ]}
                      >
                        <InputNumber
                          size="large"
                          style={{ width: "100%" }}
                          placeholder="mm"
                          min={0}
                          step={0.01}
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                      <Form.Item
                        label="Shape"
                        name="shape"
                        rules={[
                          {
                            required: true,
                            message: "Please select a shape",
                          },
                        ]}
                      >
                        <Radio.Group
                          size="large"
                          options={shapeOptions}
                          optionType="button"
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                      <Form.Item
                        label="Weight"
                        name="weight"
                        rules={[
                          {
                            required: true,
                            message: "Please enter a weight",
                          },
                        ]}
                      >
                        <InputNumber
                          size="large"
                          style={{ width: "100%" }}
                          placeholder="kg"
                          min={0}
                          step={0.01}
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                      <Form.Item
                        label="Rack no."
                        name="rackNo"
                        rules={[
                          {
                            required: true,
                            message: "Please enter a rack no",
                          },
                        ]}
                      >
                        <Input size="large" placeholder="" />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                      <Form.Item
                        label="Description"
                        name="description"
                        rules={[
                          {
                            required: true,
                            message: "Please enter a description",
                          },
                        ]}
                      >
                        <Input size="large" placeholder="" />
                      </Form.Item>
                    </Col>

                    <div className="flex-row-start">
                      {recordId ? (
                        <CustomButton
                          width={150}
                          size="large"
                          htmlType="submit"
                        >
                          Save
                        </CustomButton>
                      ) : (
                        <>
                          <CustomButton
                            width={150}
                            size="large"
                            type="Secondary"
                            htmlType="submit"
                          >
                            Add Entry
                          </CustomButton>
                          <CustomButton
                            width={150}
                            size="large"
                            onClick={handleItemSubmit}
                          >
                            Save
                          </CustomButton>
                        </>
                      )}
                    </div>
                  </Row>
                </Form>
              </>
            )}

            {step === 2 && (
              <>
                <h3 className="form-heading">Details</h3>
                <div className="details-container flex-row-space-between">
                  <div className="flex-col-start">
                    <div className="flex-col-start">
                      <span className="details-heading">Branch</span>
                      <span className="details-value">
                        {shipmentData?.branch || ""}
                      </span>
                    </div>
                    <br />
                    <div className="flex-col-start">
                      <span className="details-heading">Billing Address</span>
                      <span className="details-value">
                        {partyDetails?.name || ""}
                      </span>
                      {partyDetails?.address1 && (
                        <span className="details-heading">
                          {partyDetails?.address1}
                        </span>
                      )}
                      {partyDetails?.address2 && (
                        <span className="details-heading">
                          {partyDetails?.address2}
                        </span>
                      )}
                      {partyDetails?.mobile && partyDetails?.email && (
                        <span className="details-heading">
                          {partyDetails?.mobile} | {partyDetails?.email}
                        </span>
                      )}
                      <span className="details-value">
                        GSTIN : {partyDetails?.gstNo || ""}
                      </span>
                    </div>
                  </div>
                  <div className="flex-col-start">
                    <div className="flex-col-start">
                      <span className="details-heading">Bill Date</span>
                      <span className="details-value">
                        {getFormattedDate(shipmentData?.entryDate)}
                      </span>
                    </div>
                    <div className="flex-col-start">
                      <span className="details-heading">Entry Type</span>
                      <span className="details-value">
                        {shipmentData?.materialType || ""}
                      </span>
                    </div>
                    <div className="flex-col-start">
                      <span className="details-heading">Broker</span>
                      <span className="details-value">
                        {shipmentData?.broker || ""}
                      </span>
                    </div>
                    <div className="flex-col-start">
                      <span className="details-heading">Transport Name</span>
                      <span className="details-value">
                        {shipmentData?.transportName || ""}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="steps-left-section">
            <Steps direction="vertical" current={step} className="steps-block">
              <Steps.Step title="Shipment Details" icon={<GoOrganization />} />
              <Steps.Step title="Item Details" icon={<BsBoxSeam />} />
              <Steps.Step title="Summary" icon={<TbListDetails />} />
            </Steps>
          </div>
        </div>
      </div>

      {items && items.length ? (
        <CustomTable
          data={items}
          columns={getItemColumns({ handleRemoveItem })}
          isPaginationAllowed={false}
        />
      ) : null}

      {step === 2 && (
        <div className="flex-row-start">
          <CustomButton
            disabled={isStockEntrtyAdding || isStockEntrtyUpdating}
            width={150}
            size="large"
            onClick={recordId ? handleUpdateStock : handleAddStock}
          >
            {recordId ? "Update" : "Save"}
          </CustomButton>
          {/* Only show while adding */}
          {!recordId && (
            <CustomButton
              isLoading={isStockEntrtyAdding}
              width={150}
              size="large"
              type="Secondary"
              onClick={handleResetStep}
            >
              Edit
            </CustomButton>
          )}
        </div>
      )}
    </section>
  );
};

export default InwardForm;
