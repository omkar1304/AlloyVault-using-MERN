import { Form, Input, Modal } from "antd";
import React from "react";
import toast from "react-hot-toast";
import CustomButton from '../../../../component/CustomButton';
import { useAddOptionMutation } from "../../../../redux/api/admin/optionsApiSlice";

const AddOptionModal = ({ open, onClose, type }) => {
  const [form] = Form.useForm();
  const [addOption, { isLoading }] = useAddOptionMutation();

  const onFinish = async (values) => {
    try {
      await addOption({ ...values, type }).unwrap();
      toast.success("Option added successfully!");
    } catch (error) {
      console.error(error);
      const errMessage = error?.data?.message || "Couldn't add option!";
      toast.error(errMessage);
    }
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      okButtonProps={{ style: { display: "none" } }}
      cancelButtonProps={{ style: { display: "none" } }}
      open={open}
      onCancel={onClose}
      title={"Create New Option"}
    >
      <Form
        form={form}
        disabled={isLoading}
        layout="vertical"
        autoComplete="off"
        onFinish={onFinish}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[
            {
              required: true,
              message: "Please enter a name for the option",
            },
          ]}
        >
          <Input size="large" block />
        </Form.Item>

        <Form.Item style={{ marginTop: 4 }}>
          <CustomButton loading={isLoading} type="primary" htmlType="submit">
            Create
          </CustomButton>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddOptionModal;
