import { Breadcrumb, Button, Col, Form, Row, Select } from "antd";
import "../../../assets/css/form.css";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { PageHeader, PageSubHeader } from "../../../component/Headers";
import Input from "antd/es/input/Input";
import { useGetAsOptionQuery } from "../../../redux/api/user/optionsApiSlice";
import { useGetBrokersAsOptionQuery } from "../../../redux/api/user/brokerApiSlice";
import filterOption from "../../../helpers/filterOption";
import { AddIcon } from "../../../component/ActionComponent";
import AddBrokerModal from "./AddBrokerModal";
import CustomButton from "../../../component/CustomButton";

const CompanyForm = () => {
  const [isBrokerModalVisible, setIsBrokerModalVisible] = useState(false);
  const [form] = Form.useForm();
  const { data: partyTypeOptions, isLoading: isPartyTypeOptionsLoading } =
    useGetAsOptionQuery({ type: 5 });
  const { data: borkerOptions, isLoading: isBrokerOptionsLoading } =
    useGetBrokersAsOptionQuery({});

  const handleOnFinish = (values) => {
    console.log(values);
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
              title: "Add New Party",
            },
          ]}
        />
        <div className="margin-top">
          <PageHeader>Add New Party</PageHeader>
          <PageSubHeader>
            Record new stock received and update inventory seamlessly
          </PageSubHeader>
        </div>
      </div>

      <div className="form-section">
        <h3 className="form-heading">Company Details</h3>
        <Form
          form={form}
          //   disabled={saving}
          layout="vertical"
          autoComplete="off"
          name="normal_login"
          onFinish={handleOnFinish}
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
                    message: "Please enter a company name!",
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
          </Row>
        </Form>
      </div>
    </section>
  );
};

export default CompanyForm;
