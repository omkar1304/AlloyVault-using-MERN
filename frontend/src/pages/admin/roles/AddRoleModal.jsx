import { Form, Input, Modal } from "antd";
import React from "react";
import toast from "react-hot-toast";
import { useAddRoleMutation } from "../../../redux/api/admin/roleApiSlice";
import CustomButton from "../../../component/CustomButton";

const AddRoleModal = ({ open, onClose }) => {
  const [form] = Form.useForm();
  const [addRole, { isLoading }] = useAddRoleMutation();

  const onFinish = async (values) => {
    try {
      await addRole(values).unwrap();
      toast.success("Role added successfully!");
    } catch (error) {
      console.error(error);
      const errMessage = error?.data?.message || "Couldn't add role!";
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
      title={"Create New Role"}
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
              message: "Please enter a name for the role",
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

export default AddRoleModal;
