import { Col, Form, Input, Modal, Row, Select } from "antd";
import React, { useState } from "react";
import CustomButton from "../../../component/CustomButton";
import toast from "react-hot-toast";
import { useAddPartyRecordMutation } from "../../../redux/api/user/partyRecordApiSlice";
import { useGetAsOptionQuery } from "../../../redux/api/user/optionsApiSlice";
import { useGetBrokersAsOptionQuery } from "../../../redux/api/user/brokerApiSlice";
import {
  useGetCitiesAsOptionQuery,
  useGetCountriesAsOptionQuery,
  useGetStatesAsOptionQuery,
} from "../../../redux/api/user/locationApiSlice";
import filterOption from "../../../helpers/filterOption";
import { useWatch } from "antd/es/form/Form";
import { AddIcon } from "../../../component/ActionComponent";
import AddBrokerModal from "./AddBrokerModal";

const { TextArea } = Input;

const AddCompanyModal = ({ open, onClose }) => {
  const [isBrokerModalVisible, setIsBrokerModalVisible] = useState(false);

  const [form] = Form.useForm();
  const countryCode = useWatch("country", form);
  const stateCode = useWatch("state", form);

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

  const handleOnFinish = async (values) => {
    try {
      await addParty(values).unwrap();
      toast.success("Party added successfully!");
      form.resetFields();
      onClose();
    } catch (error) {
      console.error(error);
      const errMessage = error?.data?.message || "Couldn't add party!";
      toast.error(errMessage);
    }
  };

  const openBrokerModal = () => {
    setIsBrokerModalVisible(true);
  };

  const closeBrokerModal = () => {
    setIsBrokerModalVisible(false);
  };

  return (
    <Modal
      okButtonProps={{ style: { display: "none" } }}
      cancelButtonProps={{ style: { display: "none" } }}
      open={open}
      onCancel={onClose}
      title={"Broker Details"}
      width={"50%"}
    >
      <AddBrokerModal open={isBrokerModalVisible} onClose={closeBrokerModal} />
      <Form
        form={form}
        disabled={isPartyRecordAdding}
        layout="vertical"
        autoComplete="off"
        name="normal_login"
        onFinish={handleOnFinish}
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

          <Col xs={24} sm={24} md={12} lg={8} xl={8}>
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

          <Col xs={24} sm={24} md={12} lg={8} xl={8}>
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

          <Col xs={24} sm={24} md={12} lg={8} xl={8}>
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
            <Form.Item label="Shipping Address" name="shippingAddress">
              <TextArea
                placeholder="eg. ABC Enterprise"
                autoSize={{ minRows: 2, maxRows: 6 }}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
            <Form.Item label="Billing Address" name="billingAddress">
              <TextArea
                placeholder="eg. ABC Enterprise"
                autoSize={{ minRows: 2, maxRows: 6 }}
              />
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
                loading={isPartyRecordAdding}
                htmlType="submit"
              >
                Save
              </CustomButton>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default AddCompanyModal;
