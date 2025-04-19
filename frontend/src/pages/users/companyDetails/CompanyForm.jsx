import { Breadcrumb, Button, Col, Form, Row, Select } from "antd";
import { useWatch } from "antd/es/form/Form";
import "../../../assets/css/form.css";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { PageHeader, PageSubHeader } from "../../../component/Headers";
import Input from "antd/es/input/Input";
import { useGetAsOptionQuery } from "../../../redux/api/user/optionsApiSlice";
import { useGetBrokersAsOptionQuery } from "../../../redux/api/user/brokerApiSlice";
import filterOption from "../../../helpers/filterOption";
import { AddIcon } from "../../../component/ActionComponent";
import AddBrokerModal from "./AddBrokerModal";
import CustomButton from "../../../component/CustomButton";
import {
  useGetCitiesAsOptionQuery,
  useGetCountriesAsOptionQuery,
  useGetStatesAsOptionQuery,
} from "../../../redux/api/user/locationApiSlice";
import {
  useAddPartyRecordMutation,
  useGetPartyDetailsQuery,
  useUpdatePartyRecordMutation,
} from "../../../redux/api/user/partyRecordApiSlice";
import toast from "react-hot-toast";

const CompanyForm = () => {
  const [isBrokerModalVisible, setIsBrokerModalVisible] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const recordId = searchParams.get("recordId");

  const [form] = Form.useForm();
  const countryCode = useWatch("country", form);
  const stateCode = useWatch("state", form);

  const { data: partyDetails, refetch: fetchPartyRecordDetails } =
    useGetPartyDetailsQuery({ recordId }, { skip: !recordId });
  const { data: partyTypeOptions, isLoading: isPartyTypeOptionsLoading } =
    useGetAsOptionQuery({ type: 5 });
  const { data: borkerOptions, isLoading: isBrokerOptionsLoading } =
    useGetBrokersAsOptionQuery({});
  const { data: countryOptions, isLoading: isCountryOptionLoading } =
    useGetCountriesAsOptionQuery({});
  const { data: stateOption, isLoading: isStateOptionLoading } =
    useGetStatesAsOptionQuery({ countryCode }, { skip: !countryCode });
  const { data: cityOption, isLoading: isCityOptionLoading } =
    useGetCitiesAsOptionQuery(
      { countryCode, stateCode },
      { skip: !stateCode || !countryCode }
    );
  const [addParty, { isLoading: isPartyRecordAdding }] =
    useAddPartyRecordMutation();
  const [updateParty, { isLoading: isPartyRecordUpdating }] =
    useUpdatePartyRecordMutation();

  useEffect(() => {
    if (recordId) {
      fetchPartyRecordDetails();
    }
  }, [recordId]);

  useEffect(() => {
    if (partyDetails) {
      form.setFieldsValue(partyDetails);
    }
  }, [partyDetails, form]);

  const handleAddRecord = async (values) => {
    try {
      await addParty(values).unwrap();
      toast.success("Party added successfully!");
    } catch (error) {
      console.error(error);
      const errMessage = error?.data?.message || "Couldn't add party!";
      toast.error(errMessage);
    }
    form.resetFields();
    navigate(`/home/companyDetails`);
  };

  const handleUpdateRecord = async (values) => {
    try {
      await updateParty({ ...values, recordId }).unwrap();
      toast.success("Party updated successfully!");
    } catch (error) {
      console.error(error);
      const errMessage = error?.data?.message || "Couldn't update party!";
      toast.error(errMessage);
    }
    form.resetFields();
    navigate(`/home/companyDetails`);
  };

  const openBrokerModal = () => {
    setIsBrokerModalVisible(true);
  };

  const closeBrokerModal = () => {
    setIsBrokerModalVisible(false);
  };

  return (
    <section className="flex-col-start">
      <AddBrokerModal open={isBrokerModalVisible} onClose={closeBrokerModal} />
      <div>
        <Breadcrumb
          separator=">"
          items={[
            {
              title: <Link to="/home/companyDetails">Company List</Link>,
            },
            {
              title: recordId ? "Update Party" : "Add New Party",
            },
          ]}
        />
        <div className="margin-top">
          <PageHeader>{recordId ? "Update Party" : "Add New Party"}</PageHeader>
          <PageSubHeader>
            {recordId
              ? "Update Party details in your system"
              : "Add a new party in your system"}
          </PageSubHeader>
        </div>
      </div>

      <div className="form-section">
        <h3 className="form-heading">Company Details</h3>
        <Form
          form={form}
          disabled={isPartyRecordAdding || isPartyRecordUpdating}
          layout="vertical"
          autoComplete="off"
          name="normal_login"
          onFinish={recordId ? handleUpdateRecord : handleAddRecord}
          style={{ width: "50%" }}
          className="form-layout margin-top"
        >
          <Row gutter={[16]}>
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <Form.Item
                label="Company Name"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Please enter a company name",
                  },
                ]}
              >
                <Input size="large" block placeholder="eg. ABC Enterprise" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item label="Party Type" name="partyType">
                <Select
                  size="large"
                  style={{ width: "100%" }}
                  showSearch
                  placeholder="Select a party type"
                  optionFilterProp="children"
                  filterOption={filterOption}
                  options={partyTypeOptions}
                  disabled={isPartyTypeOptionsLoading}
                  allowClear
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item label="Broker" name="broker">
                <Select
                  size="large"
                  style={{ width: "100%" }}
                  showSearch
                  placeholder="Select a broker"
                  optionFilterProp="children"
                  filterOption={filterOption}
                  allowClear
                  disabled={isBrokerModalVisible || isBrokerOptionsLoading}
                >
                  <Select.Option value="add-broker" key="add-broker" disabled>
                    <div
                      className="flex-row-space-between"
                      style={{
                        color: "#6366F1",
                        width: "100%",
                        cursor: "pointer",
                      }}
                      onClick={openBrokerModal}
                    >
                      <span>Add Broker</span>
                      <AddIcon color="#6366F1" />
                    </div>
                  </Select.Option>
                  {borkerOptions?.map((broker) => (
                    <Select.Option
                      key={broker.value}
                      value={broker.value}
                      label={broker.label}
                    >
                      {broker.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <Form.Item
                label="GST IN"
                name="gstNo"
                rules={[
                  {
                    required: true,
                    message: "Please enter a GST",
                  },
                ]}
              >
                <Input size="large" block />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <Form.Item label="Address 1" name="address1">
                <Input size="large" block placeholder="eg. ABC Enterprise" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <Form.Item label="Address 2" name="address2">
                <Input size="large" block placeholder="eg. ABC Street" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item label="Country" name="country">
                <Select
                  size="large"
                  style={{ width: "100%" }}
                  showSearch
                  placeholder="Select a country"
                  optionFilterProp="children"
                  filterOption={filterOption}
                  options={countryOptions}
                  disabled={isCountryOptionLoading}
                  allowClear
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item label="State" name="state">
                <Select
                  size="large"
                  style={{ width: "100%" }}
                  showSearch
                  placeholder="Select a state"
                  optionFilterProp="children"
                  filterOption={filterOption}
                  options={stateOption}
                  disabled={isStateOptionLoading}
                  allowClear
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item label="City" name="city">
                <Select
                  size="large"
                  style={{ width: "100%" }}
                  showSearch
                  placeholder="Select a city"
                  optionFilterProp="children"
                  filterOption={filterOption}
                  options={cityOption}
                  disabled={isCityOptionLoading}
                  allowClear
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item label="Pin code" name="pincode">
                <Input size="large" block />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item label="Email" name="email">
                <Input size="large" block placeholder="eg. xyz@gmail.com" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item label="Phone" name="mobile">
                <Input size="large" block placeholder="000-000-0000" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item>
                <CustomButton
                  width={150}
                  size="large"
                  loading={isPartyRecordAdding || isPartyRecordUpdating}
                  htmlType="submit"
                >
                  {recordId ? "Update" : "Save"}
                </CustomButton>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    </section>
  );
};

export default CompanyForm;
