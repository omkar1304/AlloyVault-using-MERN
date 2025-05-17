import { Breadcrumb, Col, Form, Input, Row } from "antd";
import { useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { PageHeader, PageSubHeader } from "../../../component/Headers";
import CustomButton from "../../../component/CustomButton";
import toast from "react-hot-toast";
import {
  useAddTransportMutation,
  useGetTransportDetailsQuery,
  useUpdateTransportMutation,
} from "../../../redux/api/user/transportApiSlice";

const TransportForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const recordId = searchParams.get("recordId");
  const [form] = Form.useForm();

  const {
    data: transportDetails,
    refetch: fetchTransportDetails,
    isLoading: isTransportDetailsLoading,
  } = useGetTransportDetailsQuery({ recordId }, { skip: !recordId });
  const [addTransport, { isLoading: isTransportAdding }] =
    useAddTransportMutation();
  const [updateTransport, { isLoading: isTransportUpdating }] =
    useUpdateTransportMutation();

  useEffect(() => {
    if (recordId) {
      fetchTransportDetails();
    }
  }, [recordId]);

  useEffect(() => {
    if (transportDetails) {
      form.setFieldsValue(transportDetails);
    }
  }, [transportDetails, form]);

  const handleAddTransport = async (values) => {
    try {
      await addTransport(values).unwrap();
      toast.success("Transport details added successfully!");
    } catch (error) {
      console.error(error);
      const errMessage =
        error?.data?.message || "Couldn't add transport details!";
      toast.error(errMessage);
    }
    form.resetFields();
    navigate(`/home/transportDetails`);
  };

  const handleUpdateTransport = async (values) => {
    try {
      await updateTransport({ ...values, recordId }).unwrap();
      toast.success("Transport details updated successfully!");
    } catch (error) {
      console.error(error);
      const errMessage =
        error?.data?.message || "Couldn't update transport details!";
      toast.error(errMessage);
    }
    form.resetFields();
    navigate(`/home/transportDetails`);
  };

  return (
    <section className="flex-col-start">
      <div>
        <Breadcrumb
          separator=">"
          items={[
            {
              title: <Link to="/home/transportDetails">Transport Details</Link>,
            },
            {
              title: `${recordId ? "Update Transport" : "Add New Transport"}`,
            },
          ]}
        />
        <div className="margin-top">
          <PageHeader>
            {recordId ? "Update Transport" : "Add New Transport"}
          </PageHeader>
          <PageSubHeader>
            Fill in the transport information to save
          </PageSubHeader>
        </div>
      </div>

      <div className="form-section">
        <Form
          form={form}
          layout="vertical"
          autoComplete="off"
          name="normal_login"
          onFinish={recordId ? handleUpdateTransport : handleAddTransport}
          className="form-layout margin-top"
          disabled={recordId && isTransportDetailsLoading}
        >
          <Row gutter={[16]}>
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <Form.Item
                label="Transport Name"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Please enter a transport name",
                  },
                ]}
              >
                <Input size="large" block placeholder="Enter Name" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item label="Transport Id." name="transportId">
                <Input size="large" block placeholder="" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item label="Contact No." name="mobile">
                <Input size="large" block placeholder="" />
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
                  loading={isTransportAdding || isTransportUpdating}
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

export default TransportForm;
