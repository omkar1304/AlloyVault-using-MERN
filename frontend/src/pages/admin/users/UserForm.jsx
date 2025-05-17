import {
  Breadcrumb,
  Checkbox,
  Col,
  Form,
  Input,
  Row,
  Select,
  Switch,
} from "antd";
import React, { useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  useGetUserDetailsQuery,
  useUpdateUserMutation,
} from "../../../redux/api/admin/userApiSlice";
import { PageHeader, PageSubHeader } from "../../../component/Headers";
import CustomButton from "../../../component/CustomButton";
import { useGetRolesAsOptionQuery } from "../../../redux/api/admin/roleApiSlice";
import filterOption from "../../../helpers/filterOption";
import toast from "react-hot-toast";
import { useGetBranchAsOptionQuery } from "../../../redux/api/admin/branchApiSlice";

const UserForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const recordId = searchParams.get("recordId");

  const [form] = Form.useForm();

  const { data: userDetails, isLoading: isUserDetailsLoading } =
    useGetUserDetailsQuery(recordId);
  const { data: roleOptions, isLoading: isRoleOptionsLoading } =
    useGetRolesAsOptionQuery({});
  const { data: branchOptions, isLoading: isBranchOptionsLoading } =
    useGetBranchAsOptionQuery({});
  const [updateUser, { isLoading: isUserUpdating }] = useUpdateUserMutation();

  useEffect(() => {
    if (userDetails) {
      form.setFieldsValue(userDetails);
    }
  }, [userDetails]);

  const onValuesChange = (changedValues, allValues) => {
    const { firstName, lastName } = allValues;

    if ("firstName" in changedValues || "lastName" in changedValues) {
      let newDisplayName = "";
      if (changedValues.firstName)
        newDisplayName += `${changedValues.firstName}`;
      else if (firstName) newDisplayName += `${firstName}`;

      if (changedValues.lastName)
        newDisplayName += ` ${changedValues.lastName}`;
      else if (lastName) newDisplayName += ` ${lastName}`;

      form.setFieldsValue({ displayName: newDisplayName.trim() });
    }
  };

  const handleUpdateUser = async (values) => {
    try {
      await updateUser({
        recordId,
        ...values,
      }).unwrap();
      toast.success("user updated successfully!");
    } catch (error) {
      console.error(error);
      const errMessage = error?.data?.message || "Couldn't update user!";
      toast.error(errMessage);
    }
    navigate(`/admin/users`);
  };

  return (
    <section className="flex-col-start">
      <div>
        <Breadcrumb
          separator=">"
          items={[
            {
              title: <Link to="/admin/users">Users List</Link>,
            },
            {
              title: "Update User",
            },
          ]}
        />
        <div className="margin-top">
          <PageHeader>Update User</PageHeader>
          <PageSubHeader>Update user details in your system</PageSubHeader>
        </div>
      </div>

      <div className="form-section">
        <Form
          form={form}
          disabled={isUserDetailsLoading}
          layout="vertical"
          autoComplete="off"
          name="normal_login"
          onFinish={handleUpdateUser}
          onValuesChange={onValuesChange}
          className="form-layout margin-top"
        >
          <Row gutter={[16]}>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="First Name"
                name="firstName"
                rules={[
                  {
                    required: true,
                    message: "Please enter a first name",
                  },
                ]}
              >
                <Input size="large" block placeholder="eg. Jhon" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="Last Name"
                name="lastName"
                rules={[
                  {
                    required: true,
                    message: "Please enter a last name",
                  },
                ]}
              >
                <Input size="large" block placeholder="eg. Doe" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item label="Display Name" name="displayName">
                <Input size="large" block placeholder="" disabled />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  {
                    required: true,
                    type: "email",
                    message: "Please enter a valid email!",
                  },
                ]}
              >
                <Input
                  size="large"
                  block
                  placeholder="eg. John.doe@example.com"
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={24} lg={8} xl={8}>
              <Form.Item
                label="Role"
                name="role"
                rules={[{ required: true, message: "Please select a role" }]}
              >
                <Select
                  size="large"
                  style={{ width: "100%" }}
                  showSearch
                  placeholder="Select a role"
                  optionFilterProp="children"
                  filterOption={filterOption}
                  options={roleOptions}
                  loading={isRoleOptionsLoading}
                  allowClear
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={24} lg={8} xl={8}>
              <Form.Item
                label="Branch"
                name="branch"
                rules={[{ required: true, message: "Please select a branch" }]}
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
              <Form.Item label="Admin Approved" name="isAdminApproved">
                <Switch />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item>
                <CustomButton
                  width={150}
                  size="large"
                  loading={isUserUpdating}
                  htmlType="submit"
                >
                  Update
                </CustomButton>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    </section>
  );
};

export default UserForm;
