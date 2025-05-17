import { Breadcrumb, Col, Form, Input, Row, Switch } from "antd";
import { useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { PageHeader, PageSubHeader } from "../../../component/Headers";
import CustomButton from "../../../component/CustomButton";
import toast from "react-hot-toast";
import {
  useAddBranchMutation,
  useGetBranchDetailsQuery,
  useUpdateBranchMutation,
} from "../../../redux/api/admin/branchApiSlice";

const BranchForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const recordId = searchParams.get("recordId");
  const [form] = Form.useForm();

  const {
    data: branchDetails,
    refetch: fetchBranchDetails,
    isLoading: isBranchDetailsLoading,
  } = useGetBranchDetailsQuery({ recordId }, { skip: !recordId });
  const [addBranch, { isLoading: isBranchdAdding }] = useAddBranchMutation();
  const [updateBranch, { isLoading: isBranchUpdating }] =
    useUpdateBranchMutation();

  useEffect(() => {
    if (recordId) {
      fetchBranchDetails();
    }
  }, [recordId]);

  useEffect(() => {
    if (branchDetails) {
      form.setFieldsValue(branchDetails);
    }
  }, [branchDetails, form]);

  const handleAddBranch = async (values) => {
    try {
      await addBranch(values).unwrap();
      toast.success("Branch added successfully!");
    } catch (error) {
      console.error(error);
      const errMessage = error?.data?.message || "Couldn't add branch!";
      toast.error(errMessage);
    }
    form.resetFields();
    navigate(`/admin/branch`);
  };

  const handleUpdateBranch = async (values) => {
    try {
      await updateBranch({ ...values, recordId }).unwrap();
      toast.success("Branch updated successfully!");
    } catch (error) {
      console.error(error);
      const errMessage = error?.data?.message || "Couldn't update branch!";
      toast.error(errMessage);
    }
    form.resetFields();
    navigate(`/admin/branch`);
  };

  return (
    <section className="flex-col-start">
      <div>
        <Breadcrumb
          separator=">"
          items={[
            {
              title: <Link to="/admin/branch">Branch List</Link>,
            },
            {
              title: `${recordId ? "Update Branch" : "Add Branch"}`,
            },
          ]}
        />
        <div className="margin-top">
          <PageHeader>{recordId ? "Update Branch" : "Add Branch"}</PageHeader>
          <PageSubHeader>{`${
            recordId ? "Update" : "Add"
          } company details in your system`}</PageSubHeader>
        </div>
      </div>

      <div className="form-section">
        <Form
          form={form}
          layout="vertical"
          autoComplete="off"
          name="normal_login"
          onFinish={recordId ? handleUpdateBranch : handleAddBranch}
          className="form-layout margin-top"
          disabled={recordId && isBranchDetailsLoading}
        >
          <Row gutter={[16]}>
            <Col xs={24} sm={24} md={24} lg={8} xl={8}>
              <Form.Item
                label="Branch Name"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Please enter a branch name",
                  },
                ]}
              >
                <Input size="large" block placeholder="eg. Branch" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={24} lg={8} xl={8}>
              <Form.Item
                label="Prefix"
                name="prefix"
                rules={[
                  {
                    required: true,
                    message: "Please enter a branch prefix",
                  },
                ]}
              >
                <Input size="large" block placeholder="BRH" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={24} lg={8} xl={8}>
              <Form.Item label="Enabled" name="isEnabled">
                <Switch
                  size="large"
                  defaultChecked
                  unCheckedChildren={"In-Active"}
                  checkedChildren={"Active"}
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={24} lg={8} xl={8}>
              <Form.Item label="Address 1" name="address1">
                <Input size="large" block placeholder="eg. ABC Enterprise" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={24} lg={8} xl={8}>
              <Form.Item label="Address 2" name="address2">
                <Input size="large" block placeholder="eg. ABC Street" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={24} lg={8} xl={8}>
              <Form.Item label="Address 3" name="address3">
                <Input size="large" block placeholder="eg. City 000000" />
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
                  loading={isBranchdAdding || isBranchUpdating}
                  htmlType="submit"
                >
                  {recordId ? "Update" : "Add"}
                </CustomButton>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    </section>
  );
};

export default BranchForm;
