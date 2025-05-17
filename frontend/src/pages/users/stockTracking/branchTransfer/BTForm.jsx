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
import {
  useAddStockEntryForBTMutation,
  useAddStockEntryMutation,
  useGetStockEntryDetailsQuery,
  useUpdateStockEntryMutation,
} from "../../../../redux/api/user/stockEntryApiSlice";
import { useGetPartyRecordsAsOptionQuery } from "../../../../redux/api/user/partyRecordApiSlice";
import { useGetAsOptionQuery } from "../../../../redux/api/user/optionsApiSlice";
import toast from "react-hot-toast";
import AddCompanyModal from "../../companyDetails/AddCompanyModal";
import ItemModal from "./ItemModal";
import filterOption from "../../../../helpers/filterOption";
import CustomButton from "../../../../component/CustomButton";
import { PageHeader, PageSubHeader } from "../../../../component/Headers";
import { AddIcon } from "../../../../component/ActionComponent";
import { GoOrganization } from "react-icons/go";
import { BsBoxSeam } from "react-icons/bs";
import { TbListDetails } from "react-icons/tb";
import { useGetCompaniesAsOptionQuery } from "../../../../redux/api/user/companyApiSlice";
import { useGetBrokersAsOptionQuery } from "../../../../redux/api/user/brokerApiSlice";
import AddBrokerModal from "../../companyDetails/AddBrokerModal";
import { useWatch } from "antd/es/form/Form";
import CustomTable from "../../../../component/CustomTable";
import getItemColumns from "./getItemColumns";
import dayjs from "dayjs";
import encryptString from "../../../../helpers/encryptString";
import { useGetInvoiceNumberQuery } from "../../../../redux/api/user/invoiceCounterApiSlice";
import { useGetBranchAsOptionQuery } from "../../../../redux/api/user/branchApiSlice";

const getBranchForInvoice = ({
  btType,
  btTypeOptions,
  toBranch,
  fromBranch,
}) => {
  // If BT-In then invoice Number should have toBranch in it
  // If BT-Out then invoice Number should have fromBranch in it

  const result = btTypeOptions?.find(
    (option) => option.value === btType
  )?.label;

  return /In/i.test(result) ? toBranch : fromBranch;
};

const BTForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const recordId = searchParams.get("recordId");
  const [step, setStep] = useState(0);
  const [items, setItems] = useState([]);
  const [singleItem, setSingleItem] = useState({});
  const [totalWeight, setTotalWeight] = useState(0);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isBrokerModalVisible, setIsBrokerModalVisible] = useState(false);
  const [isCompanyModalVisible, setIsCompanyModalVisible] = useState(false);
  const [shipmentForm] = Form.useForm();
  const [itemForm] = Form.useForm();
  const company = useWatch("company", shipmentForm);
  const fromBranch = useWatch("fromBranch", shipmentForm);
  const toBranch = useWatch("toBranch", shipmentForm);
  const btType = useWatch("btType", shipmentForm);

  const { data: stockEntryDetails, refetch: fetchStockEntryDetails } =
    useGetStockEntryDetailsQuery({ recordId }, { skip: !recordId });
  const { data: companyOptions, isLoading: isCompanyOptionsLoading } =
    useGetCompaniesAsOptionQuery({});
  const { data: borkerOptions, isLoading: isBrokerOptionsLoading } =
    useGetBrokersAsOptionQuery({});
  const { data: partyOptions, isLoading: isPartyOptionsLoading } =
    useGetPartyRecordsAsOptionQuery();
  const { data: btTypeOptions, isLoading: isbtTypeOptionsLoading } =
    useGetAsOptionQuery({ type: 8 });
  const { data: materialTypeOptions, isLoading: isMaterialTypeOptionsLoading } =
    useGetAsOptionQuery({ type: 3 });
  const { data: gradeOptions, isLoading: isGradeOptionsLoading } =
    useGetAsOptionQuery({ type: 4 });
  const { data: shapeOptions, isLoading: isShapeOptionsLoading } =
    useGetAsOptionQuery({ type: 6 });
  const { data: branchOptions, isLoading: isBranchOptionsLoading } =
    useGetBranchAsOptionQuery(
      { comapnyId: company, withCompanyLabel: true },
      { skip: !company }
    );
  const { data: invoiceObj, isLoading: isInvoiceNumberLoading } =
    useGetInvoiceNumberQuery(
      {
        branchId: getBranchForInvoice({
          btType,
          btTypeOptions,
          toBranch,
          fromBranch,
        }),
        isBT: true,
      },
      {
        skip:
          !getBranchForInvoice({
            btType,
            btTypeOptions,
            toBranch,
            fromBranch,
          }) || !btType,
      }
    );
  const [addStockEntryForBT, { isLoading: isStockEntrtyAdding }] =
    useAddStockEntryForBTMutation();
  const [updateStockEntry, { isLoading: isStockEntrtyUpdating }] =
    useUpdateStockEntryMutation();

  // Update Form
  useEffect(() => {
    if (stockEntryDetails) {
      shipmentForm.setFieldsValue({
        ...stockEntryDetails,
        entryDate: dayjs(stockEntryDetails?.entryDate || null),
      });
      itemForm.setFieldsValue(stockEntryDetails);
    }
  }, [stockEntryDetails]);

  // Invoice Counter
  useEffect(() => {
    if (invoiceObj) {
      shipmentForm.setFieldValue("challanNo", invoiceObj?.invoiceNumber);
    }
  }, [invoiceObj]);

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
    console.log("shipmentData", shipmentForm.getFieldsValue());
    console.log("items", items);
    console.log("totalWeight", totalWeight);
    try {
      await addStockEntryForBT({
        shipmentData: shipmentForm.getFieldsValue(),
        items,
        type: "BT",
        totalWeight,
      }).unwrap();
      toast.success("Record added successfully!");
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
      navigate(`/home/branchTransfer`);
    } catch (error) {
      console.error(error);
      const errMessage = error?.data?.message || "Couldn't update record!";
      toast.error(errMessage);
    }
  };

  const onValuesChange = (changedValues, allValues) => {
    if ("billTo" in changedValues) {
      shipmentForm.setFieldsValue({ shipTo: changedValues?.billTo });
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

  const openBrokerModal = () => {
    setIsBrokerModalVisible(true);
  };

  const closeBrokerModal = () => {
    setIsBrokerModalVisible(false);
  };

  const openCompanyModal = () => {
    setIsCompanyModalVisible(true);
  };

  const closeCompanyModal = () => {
    setIsCompanyModalVisible(false);
  };

  return (
    <section className="flex-col-start">
      <AddBrokerModal open={isBrokerModalVisible} onClose={closeBrokerModal} />
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
              title: <Link to="/home/branchTransfer">Branch Transfer</Link>,
            },
            {
              title: recordId ? "Update Entry" : "New Entry",
            },
          ]}
        />
        <div className="margin-top">
          <PageHeader>
            {recordId ? "Update Branch Transfer" : "New Branch Transfer"}
          </PageHeader>
          <PageSubHeader>Record stock movement between branches.</PageSubHeader>
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
                  onValuesChange={onValuesChange}
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
                      <Form.Item
                        label="Company Name"
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
                          options={companyOptions}
                          loading={isCompanyOptionsLoading}
                          allowClear
                        />
                      </Form.Item>
                    </Col>

                    {recordId ? (
                      <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <Form.Item
                          label="Branch"
                          name="branch"
                          rules={[
                            {
                              required: true,
                              message: "Please select a branch",
                            },
                          ]}
                        >
                          <Select
                            size="large"
                            style={{ width: "100%" }}
                            showSearch
                            placeholder="Select a branch"
                            optionFilterProp="children"
                            filterOption={filterOption}
                            options={branchOptions ?? []}
                            loading={isBranchOptionsLoading}
                            allowClear
                          />
                        </Form.Item>
                      </Col>
                    ) : (
                      <>
                        <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                          <Form.Item
                            label="From Branch"
                            name="fromBranch"
                            dependencies={["toBranch"]}
                            rules={[
                              {
                                required: true,
                                message: "Please select a branch",
                              },
                              ({ getFieldValue }) => ({
                                validator(_, value) {
                                  if (
                                    !value ||
                                    getFieldValue("toBranch") !== value
                                  ) {
                                    return Promise.resolve();
                                  }
                                  return Promise.reject(
                                    new Error(
                                      "From and to branch should not be the same"
                                    )
                                  );
                                },
                              }),
                            ]}
                          >
                            <Select
                              size="large"
                              style={{ width: "100%" }}
                              showSearch
                              placeholder="Select a branch"
                              optionFilterProp="children"
                              filterOption={filterOption}
                              options={branchOptions ?? []}
                              loading={isBranchOptionsLoading}
                              allowClear
                            />
                          </Form.Item>
                        </Col>

                        <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                          <Form.Item
                            label="To Branch"
                            name="toBranch"
                            dependencies={["fromBranch"]}
                            rules={[
                              {
                                required: true,
                                message: "Please select a branch",
                              },
                              ({ getFieldValue }) => ({
                                validator(_, value) {
                                  if (
                                    !value ||
                                    getFieldValue("fromBranch") !== value
                                  ) {
                                    return Promise.resolve();
                                  }
                                  return Promise.reject(
                                    new Error(
                                      "From and to branch should not be the same"
                                    )
                                  );
                                },
                              }),
                            ]}
                          >
                            <Select
                              size="large"
                              style={{ width: "100%" }}
                              showSearch
                              placeholder="Select a branch"
                              optionFilterProp="children"
                              filterOption={filterOption}
                              options={branchOptions ?? []}
                              loading={isBranchOptionsLoading}
                              allowClear
                            />
                          </Form.Item>
                        </Col>
                      </>
                    )}

                    <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                      <Form.Item
                        label="BT Type"
                        name="btType"
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
                          options={btTypeOptions}
                          loading={isbtTypeOptionsLoading}
                          allowClear
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                      <Form.Item
                        label="Challan No"
                        name="challanNo"
                        rules={[
                          {
                            required: true,
                          },
                        ]}
                      >
                        <Input size="large" placeholder="" disabled />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                      <Form.Item label="Transport Name" name="transportName">
                        <Input size="large" placeholder="" />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                      <Form.Item label="Vehicle No." name="vehicleNo">
                        <Input size="large" placeholder="" />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                      <Form.Item label="Description" name="shipmentDesc">
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
                      <Form.Item label="Rate" name="rate">
                        <InputNumber
                          size="large"
                          style={{ width: "100%" }}
                          placeholder=""
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

                    <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                      <Form.Item label="Pcs/Bdls" name="unit">
                        <Input size="large" placeholder="" />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={24} lg={16} xl={16}>
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
                            disabled={!items.length}
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
                <h3 className="form-heading">Branch Transfer Overview</h3>
                <Form
                  className="full-width form-layout"
                  layout="vertical"
                  form={shipmentForm}
                  onFinish={handleShipmentSubmit}
                  onValuesChange={onValuesChange}
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
                      <Form.Item
                        label="Company Name"
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
                          options={companyOptions}
                          loading={isCompanyOptionsLoading}
                          allowClear
                        />
                      </Form.Item>
                    </Col>

                    {recordId ? (
                      <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <Form.Item
                          label="Branch"
                          name="branch"
                          rules={[
                            {
                              required: true,
                              message: "Please select a branch",
                            },
                          ]}
                        >
                          <Select
                            size="large"
                            style={{ width: "100%" }}
                            showSearch
                            placeholder="Select a branch"
                            optionFilterProp="children"
                            filterOption={filterOption}
                            options={branchOptions ?? []}
                            loading={isBranchOptionsLoading}
                            allowClear
                          />
                        </Form.Item>
                      </Col>
                    ) : (
                      <>
                        <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                          <Form.Item
                            label="From Branch"
                            name="fromBranch"
                            dependencies={["toBranch"]}
                            rules={[
                              {
                                required: true,
                                message: "Please select a branch",
                              },
                              ({ getFieldValue }) => ({
                                validator(_, value) {
                                  if (
                                    !value ||
                                    getFieldValue("toBranch") !== value
                                  ) {
                                    return Promise.resolve();
                                  }
                                  return Promise.reject(
                                    new Error(
                                      "From and to branch should not be the same"
                                    )
                                  );
                                },
                              }),
                            ]}
                          >
                            <Select
                              size="large"
                              style={{ width: "100%" }}
                              showSearch
                              placeholder="Select a branch"
                              optionFilterProp="children"
                              filterOption={filterOption}
                              options={branchOptions ?? []}
                              loading={isBranchOptionsLoading}
                              allowClear
                            />
                          </Form.Item>
                        </Col>

                        <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                          <Form.Item
                            label="To Branch"
                            name="toBranch"
                            dependencies={["fromBranch"]}
                            rules={[
                              {
                                required: true,
                                message: "Please select a branch",
                              },
                              ({ getFieldValue }) => ({
                                validator(_, value) {
                                  if (
                                    !value ||
                                    getFieldValue("fromBranch") !== value
                                  ) {
                                    return Promise.resolve();
                                  }
                                  return Promise.reject(
                                    new Error(
                                      "From and to branch should not be the same"
                                    )
                                  );
                                },
                              }),
                            ]}
                          >
                            <Select
                              size="large"
                              style={{ width: "100%" }}
                              showSearch
                              placeholder="Select a branch"
                              optionFilterProp="children"
                              filterOption={filterOption}
                              options={branchOptions ?? []}
                              loading={isBranchOptionsLoading}
                              allowClear
                            />
                          </Form.Item>
                        </Col>
                      </>
                    )}

                    <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                      <Form.Item
                        label="BT Type"
                        name="btType"
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
                          options={btTypeOptions}
                          loading={isbtTypeOptionsLoading}
                          allowClear
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                      <Form.Item
                        label="Challan No"
                        name="challanNo"
                        rules={[
                          {
                            required: true,
                          },
                        ]}
                      >
                        <Input size="large" placeholder="" disabled />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                      <Form.Item label="Transport Name" name="transportName">
                        <Input size="large" placeholder="" />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                      <Form.Item label="Vehicle No." name="vehicleNo">
                        <Input size="large" placeholder="" />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                      <Form.Item label="Description" name="shipmentDesc">
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
            <span>{`${parseFloat(totalWeight).toFixed(2)} kg`}</span>
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

export default BTForm;
