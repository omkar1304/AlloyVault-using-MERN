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
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { PageHeader, PageSubHeader } from "../../../../component/Headers";
import { GoOrganization } from "react-icons/go";
import { TbListDetails } from "react-icons/tb";
import { BsBoxSeam } from "react-icons/bs";
import { useGetPartyRecordsAsOptionQuery } from "../../../../redux/api/user/partyRecordApiSlice";
import filterOption from "../../../../helpers/filterOption";
import { useGetAsOptionQuery } from "../../../../redux/api/user/optionsApiSlice";
import CustomButton from "../../../../component/CustomButton";
import CustomTable from "../../../../component/CustomTable";
import getItemColumns from "./getItemColumns";
import toast from "react-hot-toast";
import {
  useAddStockEntryForInwardMutation,
  useGetStockEntryDetailsQuery,
  useUpdateStockEntryMutation,
} from "../../../../redux/api/user/stockEntryApiSlice";
import dayjs from "dayjs";
import ItemModal from "./ItemModal";
import { AddIcon } from "../../../../component/ActionComponent";
import AddCompanyModal from "../../companyDetails/AddCompanyModal";
import { useGetBranchAsOptionQuery } from "../../../../redux/api/user/branchApiSlice";
import { useGetTransportAsOptionQuery } from "../../../../redux/api/user/transportApiSlice";

const InwardForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const recordId = searchParams.get("recordId");
  const [step, setStep] = useState(0);
  const [items, setItems] = useState([]);
  const [singleItem, setSingleItem] = useState({});
  const [totalWeight, setTotalWeight] = useState(0);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isCompanyModalVisible, setIsCompanyModalVisible] = useState(false);
  const [shipmentForm] = Form.useForm();
  const [itemForm] = Form.useForm();

  const { data: stockEntryDetails, refetch: fetchStockEntryDetails } =
    useGetStockEntryDetailsQuery({ recordId }, { skip: !recordId });
  const { data: partyOptions, isLoading: isPartyOptionsLoading } =
    useGetPartyRecordsAsOptionQuery();
  const { data: branchOptions, isLoading: isBranchOptionsLoading } =
    useGetBranchAsOptionQuery({});
  const { data: inwardTypeOptions, isLoading: isInwardTypeOptionsLoading } =
    useGetAsOptionQuery({ type: 2 });
  const { data: materialTypeOptions, isLoading: isMaterialTypeOptionsLoading } =
    useGetAsOptionQuery({ type: 3 });
  const { data: gradeOptions, isLoading: isGradeOptionsLoading } =
    useGetAsOptionQuery({ type: 4 });
  const { data: shapeOptions, isLoading: isShapeOptionsLoading } =
    useGetAsOptionQuery({ type: 6 });
  const { data: transportOptions, isLoading: isTransportOptionsLoading } =
    useGetTransportAsOptionQuery({});
  const [addStockEntryForInward, { isLoading: isStockEntrtyAdding }] =
    useAddStockEntryForInwardMutation();
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
    setTotalWeight((prev) => prev + item?.weight);

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
    const deletedItems = items?.find((item) => item.uniqueKey === uniqueKey);
    setTotalWeight((prev) => prev - deletedItems?.weight);
    setItems(filteredItems);
  };

  const handleAddStock = async () => {
    try {
      await addStockEntryForInward({
        shipmentData: shipmentForm.getFieldsValue(),
        items,
        type: "Inward",
      }).unwrap();
      toast.success("Record added successfully!");
      navigate(`/home/inward`);
    } catch (error) {
      console.error(error);
      const errMessage = error?.data?.message || "Couldn't add record!";
      toast.error(errMessage);
    }
  };

  const handleUpdateStock = async () => {
    try {
      await updateStockEntry({
        recordId,
        ...shipmentForm.getFieldsValue(),
        ...items[0],
      }).unwrap();
      toast.success("Record updated successfully!");
      navigate(`/home/inward`);
    } catch (error) {
      console.error(error);
      const errMessage = error?.data?.message || "Couldn't update record!";
      toast.error(errMessage);
    }
  };

  const openItemModal = (item) => {
    setSingleItem(item);
    setIsItemModalOpen(true);
  };

  const closeItemModal = () => {
    setSingleItem({});
    setIsItemModalOpen(false);
  };

  const openCompanyModal = () => {
    setIsCompanyModalVisible(true);
  };

  const closeCompanyModal = () => {
    setIsCompanyModalVisible(false);
  };

  return (
    <section className="flex-col-start">
      <AddCompanyModal
        open={isCompanyModalVisible}
        onClose={closeCompanyModal}
      />
      <ItemModal
        open={isItemModalOpen}
        onCancel={closeItemModal}
        initialValue={singleItem}
        setItems={setItems}
        setTotalWeight={setTotalWeight}
        materialTypeOptions={materialTypeOptions}
        gradeOptions={gradeOptions}
        shapeOptions={shapeOptions}
      />
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
                >
                  <Row gutter={[16]}>
                    <Col xs={24} sm={24} md={24} lg={8} xl={8}>
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

                    <Col xs={24} sm={24} md={24} lg={8} xl={8}>
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
                          loading={isBranchOptionsLoading}
                          allowClear
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                      <Form.Item
                        label="Inward Type"
                        name="inwardType"
                        rules={[
                          {
                            required: true,
                            message: "Please select a type",
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
                          options={inwardTypeOptions}
                          loading={isInwardTypeOptionsLoading}
                          allowClear
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                      <Form.Item
                        label="Party Name"
                        name="party"
                        rules={[
                          {
                            required: true,
                            message: "Please select a party",
                          },
                        ]}
                      >
                        <Select
                          size="large"
                          style={{ width: "100%" }}
                          showSearch
                          placeholder="Select a party"
                          optionFilterProp="children"
                          filterOption={filterOption}
                          loading={isPartyOptionsLoading}
                          disabled={
                            isCompanyModalVisible || isPartyOptionsLoading
                          }
                          allowClear
                        >
                          <Select.Option
                            value="add-party"
                            key="add-party"
                            disabled
                          >
                            <div
                              className="flex-row-space-between"
                              style={{
                                color: "#6366F1",
                                width: "100%",
                                cursor: "pointer",
                              }}
                              onClick={openCompanyModal}
                            >
                              <span>Add Party</span>
                              <AddIcon color="#6366F1" />
                            </div>
                          </Select.Option>
                          {partyOptions?.map((party) => (
                            <Select.Option
                              key={party.value}
                              value={party.value}
                              label={party.label}
                            >
                              {party.label}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                      <Form.Item label="Transport Name" name="transportName">
                        <Select
                          size="large"
                          style={{ width: "100%" }}
                          showSearch
                          placeholder="Select a transport"
                          optionFilterProp="children"
                          filterOption={filterOption}
                          options={transportOptions}
                          loading={isTransportOptionsLoading}
                          allowClear
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                      <Form.Item label="Vehicle No." name="vehicleNo">
                        <Input size="large" placeholder="" />
                      </Form.Item>
                    </Col>
                  </Row>
                  <br />
                  <Row>
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
                <h3 className="form-heading">Item Details</h3>
                <Form
                  className="full-width form-layout"
                  layout="vertical"
                  form={itemForm}
                  onFinish={handleAddItem}
                >
                  <Row gutter={[16]}>
                    <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                      <Form.Item
                        name="materialType"
                        label="Material Type"
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
                          placeholder="Select a material type"
                          optionFilterProp="children"
                          filterOption={filterOption}
                          options={materialTypeOptions}
                          loading={isMaterialTypeOptionsLoading}
                          allowClear
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                      <Form.Item label="HSN Code" name="HSNCode">
                        <Input size="large" placeholder="" />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={24} lg={8} xl={8}>
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
                          loading={isGradeOptionsLoading}
                          allowClear
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={24} lg={8} xl={8}>
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

                    <Col xs={24} sm={24} md={24} lg={8} xl={8}>
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
                        <Select
                          size="large"
                          style={{ width: "100%" }}
                          showSearch
                          placeholder="Select a shape"
                          optionFilterProp="children"
                          filterOption={filterOption}
                          options={shapeOptions}
                          loading={isShapeOptionsLoading}
                          allowClear
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={24} lg={8} xl={8}>
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

                    <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                      <Form.Item label="Rack no." name="rackNo">
                        <Input size="large" placeholder="" />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                      <Form.Item label="Description" name="description">
                        <Input size="large" placeholder="" />
                      </Form.Item>
                    </Col>
                  </Row>
                  <br />
                  <Row>
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
                <h3 className="form-heading">Inward Overview</h3>
                <Form
                  className="full-width form-layout"
                  layout="vertical"
                  form={shipmentForm}
                  onFinish={handleShipmentSubmit}
                >
                  <Row gutter={[16]}>
                    <Col xs={24} sm={24} md={24} lg={8} xl={8}>
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

                    <Col xs={24} sm={24} md={24} lg={8} xl={8}>
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
                          loading={isBranchOptionsLoading}
                          allowClear
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                      <Form.Item
                        label="Inward Type"
                        name="inwardType"
                        rules={[
                          {
                            required: true,
                            message: "Please select a type",
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
                          options={inwardTypeOptions}
                          loading={isInwardTypeOptionsLoading}
                          allowClear
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                      <Form.Item
                        label="Party Name"
                        name="party"
                        rules={[
                          {
                            required: true,
                            message: "Please select a party",
                          },
                        ]}
                      >
                        <Select
                          size="large"
                          style={{ width: "100%" }}
                          showSearch
                          placeholder="Select a party"
                          optionFilterProp="children"
                          filterOption={filterOption}
                          loading={isPartyOptionsLoading}
                          disabled={
                            isCompanyModalVisible || isPartyOptionsLoading
                          }
                          allowClear
                        >
                          <Select.Option
                            value="add-party"
                            key="add-party"
                            disabled
                          >
                            <div
                              className="flex-row-space-between"
                              style={{
                                color: "#6366F1",
                                width: "100%",
                                cursor: "pointer",
                              }}
                              onClick={openCompanyModal}
                            >
                              <span>Add Party</span>
                              <AddIcon color="#6366F1" />
                            </div>
                          </Select.Option>
                          {partyOptions?.map((party) => (
                            <Select.Option
                              key={party.value}
                              value={party.value}
                              label={party.label}
                            >
                              {party.label}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                      <Form.Item label="Transport Name" name="transportName">
                        <Select
                          size="large"
                          style={{ width: "100%" }}
                          showSearch
                          placeholder="Select a transport"
                          optionFilterProp="children"
                          filterOption={filterOption}
                          options={transportOptions}
                          loading={isTransportOptionsLoading}
                          allowClear
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                      <Form.Item label="Vehicle No." name="vehicleNo">
                        <Input size="large" placeholder="" />
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
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
        <>
          <CustomTable
            data={items}
            columns={getItemColumns({
              recordId,
              handleRemoveItem,
              openItemModal,
              materialTypeOptions,
              gradeOptions,
              shapeOptions,
            })}
            isPaginationAllowed={false}
          />
          <div className=" full-width flex-row-space-between total-weight-container">
            <span>Total Weight</span>
            <span>{`${totalWeight} kg`}</span>
          </div>
        </>
      ) : null}

      {step === 2 && (
        <div className="flex-row-start lg-mt">
          <CustomButton
            disabled={isStockEntrtyAdding || isStockEntrtyUpdating}
            width={150}
            size="large"
            onClick={recordId ? handleUpdateStock : handleAddStock}
          >
            {recordId ? "Update" : "Save"}
          </CustomButton>
        </div>
      )}
    </section>
  );
};

export default InwardForm;
