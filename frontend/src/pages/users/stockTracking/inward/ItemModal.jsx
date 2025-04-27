import { Col, Form, Input, InputNumber, Modal, Row, Select } from "antd";
import React, { useEffect } from "react";
import filterOption from "../../../../helpers/filterOption";
import CustomButton from "../../../../component/CustomButton";

const ItemModal = ({
  open,
  onCancel,
  initialValue,
  setItems,
  setTotalWeight,
  materialClassOptions,
  gradeOptions,
  shapeOptions,
}) => {
  const [form] = Form.useForm();

  const onFinish = (item) => {
    setItems((prevItems) => {
      return prevItems?.map((prevItem) =>
        prevItem.uniqueKey === initialValue.uniqueKey
          ? { ...item, uniqueKey: Date.now() }
          : { ...prevItem }
      );
    });
    setTotalWeight(
      (prevWeight) => prevWeight - initialValue?.weight + item?.weight
    );
    form.resetFields();
    onCancel();
  };

  useEffect(() => {
    if (initialValue) {
      form.setFieldsValue(initialValue);
    }
  }, [initialValue]);

  return (
    <Modal
      width="50%"
      title="Basic Modal"
      open={open}
      onCancel={onCancel}
      footer={null}
    >
      <Form
        className="full-width form-layout"
        layout="vertical"
        form={form}
        onFinish={onFinish}
        initialValues={initialValue}
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
        <Row justify={"end"}>
          <CustomButton width={150} size="large" htmlType="submit">
            Save
          </CustomButton>
        </Row>
      </Form>
    </Modal>
  );
};

export default ItemModal;
