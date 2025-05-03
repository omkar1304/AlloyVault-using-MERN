import { Col, Form, Input, Modal, Row } from "antd";
import React from "react";
import CustomButton from "../../../component/CustomButton";
import { useAddBrokerMutation } from "../../../redux/api/user/brokerApiSlice";
import toast from "react-hot-toast";

const AddBrokerModal = ({ open, onClose }) => {
  const [form] = Form.useForm();
  const [addBroker, { isLoading }] = useAddBrokerMutation();

  const handleOnFinish = async (values) => {
    try {
      await addBroker(values).unwrap();
      toast.success("Broker added successfully!");
      form.resetFields();
      onClose();
    } catch (error) {
      console.error(error);
      const errMessage = error?.data?.message || "Couldn't add broker!";
      toast.error(errMessage);
    }
  };
  return (
    <Modal
      okButtonProps={{ style: { display: "none" } }}
      cancelButtonProps={{ style: { display: "none" } }}
      open={open}
      onCancel={onClose}
      title={"Broker Details"}
    >
      <Form
        form={form}
        disabled={isLoading}
        layout="vertical"
        autoComplete="off"
        name="normal_login"
        onFinish={handleOnFinish}
        style={{ width: "100%" }}
        className="form-layout margin-top"
      >
        <Row gutter={[16]}>
          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
            <Form.Item
              label="Broker Name"
              name="name"
              rules={[
                {
                  required: true,
                  message: "Please enter a company name!",
                },
              ]}
            >
              <Input size="large" block placeholder="John Doe" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item label="Pan no." name="panNo">
              <Input size="large" block placeholder="eg. xyz@gmail.com" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item label="Phone no." name="mobile">
              <Input size="large" block placeholder="000-000-0000" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
            <Form.Item label="Address" name="address">
              <Input size="large" block />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item style={{ marginTop: 4 }}>
          <CustomButton
            isLoading={isLoading}
            type="primary"
            htmlType="submit"
            size="large"
          >
            Save
          </CustomButton>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddBrokerModal;
