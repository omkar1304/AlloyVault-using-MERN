import {
  Breadcrumb,
  Col,
  Divider,
  Form,
  Input,
  Row,
  Select,
  Upload,
} from "antd";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { PageHeader, PageSubHeader } from "../../../component/Headers";
import CustomButton from "../../../component/CustomButton";
import { useGetAsOptionQuery } from "../../../redux/api/user/optionsApiSlice";
import filterOption from "../../../helpers/filterOption";
import toast from "react-hot-toast";
import {
  useAddCompanyMutation,
  useGetCompanyDetailsQuery,
  useUpdateCompanyMutation,
} from "../../../redux/api/admin/companyApiSlice";
import getFlattenObject from "../../../helpers/flattenObject";
import { BASE_URL } from "../../../redux/constant";
import { EditFieldIcon } from "../../../component/ActionComponent";
import { BsUpload } from "react-icons/bs";

const CompanyForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const recordId = searchParams.get("recordId");
  const [fileList, setFileList] = useState([]);
  const [isImgEditable, setIsImgEditable] = useState(false);
  const [form] = Form.useForm();

  const { data: branchOptions, isLoading: isBranchOptionsLoading } =
    useGetAsOptionQuery({ type: 1 });
  const {
    data: companyDetails,
    isLoading: isCompanyDetailsLoading,
    refetch: fetchCompanyDetails,
  } = useGetCompanyDetailsQuery({ recordId }, { skip: !recordId });
  const [addCompany, { isLoading: isCompanyAdding }] = useAddCompanyMutation();
  const [updateCompany, { isLoading: isCompanyUpdating }] =
    useUpdateCompanyMutation();

  useEffect(() => {
    if (recordId) {
      fetchCompanyDetails();
    }
  }, [recordId]);

  useEffect(() => {
    if (companyDetails) {
      const flatData = getFlattenObject(companyDetails);
      form.setFieldsValue(flatData);
    }
  }, [companyDetails, form]);

  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const beforeUpload = (file) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      toast.error("You can only upload image files!");
    }
    return isImage ? false : Upload.LIST_IGNORE;
  };

  const toggleEditMode = () => setIsImgEditable((prev) => !prev);

  const renderCompanyImage = () => {
    const companyImgURL = `${BASE_URL}/uploads/companyImages/${companyDetails?.imgURL}`;

    return (
      <div className="flex-row-start">
        <img alt="company image" src={companyImgURL} className="form-image" />
        <div
          className="image-profile-upload-icon-overlay"
          onClick={toggleEditMode}
        >
          <EditFieldIcon />
        </div>
      </div>
    );
  };

  const handleAddCompany = async (values) => {
    try {
      const formData = new FormData();

      Object.keys(values)?.forEach((key) => {
        formData.append(key, values[key]);
      });
      if (fileList?.[0]?.originFileObj) {
        formData.append("imgURL", fileList[0].originFileObj);
      }

      await addCompany(formData).unwrap();
      toast.success("Company added successfully!");
      form.resetFields();
      navigate(`/admin/company`);
    } catch (error) {
      console.error(error);
      const errMessage = error?.data?.message || "Couldn't add company!";
      toast.error(errMessage);
    }
  };

  const handleUpdateCompany = async (values) => {
    try {
      const formData = new FormData();

      Object.keys(values)?.forEach((key) => {
        formData.append(key, values[key]);
      });
      if (fileList?.[0]?.originFileObj) {
        formData.append("imgURL", fileList[0].originFileObj);
      }

      await updateCompany({ recordId, data: formData }).unwrap();
      toast.success("Company updated successfully!");
      form.resetFields();
      navigate(`/admin/company`);
    } catch (error) {
      console.error(error);
      const errMessage = error?.data?.message || "Couldn't update company!";
      toast.error(errMessage);
    }
  };

  return (
    <section className="flex-col-start">
      <div>
        <Breadcrumb
          separator=">"
          items={[
            {
              title: <Link to="/admin/company">Company List</Link>,
            },
            {
              title: `${recordId ? "Update Company" : "Add Company"}`,
            },
          ]}
        />
        <div className="margin-top">
          <PageHeader>{recordId ? "Update Company" : "Add Company"}</PageHeader>
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
          onFinish={recordId ? handleUpdateCompany : handleAddCompany}
          className="form-layout margin-top"
          disabled={isCompanyDetailsLoading}
        >
          <Row gutter={[16]}>
            <Col xs={24} sm={24} md={24} lg={8} xl={8}>
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
                <Input size="large" block placeholder="eg. Jhon" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={24} lg={8} xl={8}>
              <Form.Item
                label="Phone"
                name="mobile"
                rules={[
                  {
                    required: true,
                    message: "Please enter a mobile",
                  },
                ]}
              >
                <Input size="large" block placeholder="000-000-0000" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={24} lg={8} xl={8}>
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
                  placeholder="eg. company@example.com"
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
              <Form.Item label="Pin code" name="pincode">
                <Input size="large" block />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={24} lg={8} xl={8}>
              <Form.Item
                label="Branch"
                name="branches"
                rules={[{ required: true, message: "Please select a branch" }]}
              >
                <Select
                  mode="multiple"
                  size="large"
                  style={{ width: "100%" }}
                  showSearch
                  placeholder="Select a branch"
                  optionFilterProp="children"
                  filterOption={filterOption}
                  options={branchOptions}
                  loading={isBranchOptionsLoading}
                  maxTagCount="responsive"
                  allowClear
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={24} lg={8} xl={8}>
              <Form.Item
                label="GST No."
                name="gstNo"
                rules={[
                  {
                    required: true,
                    message: "Please enter GST No.",
                  },
                ]}
              >
                <Input size="large" block />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={24} lg={8} xl={8}>
              <Form.Item
                label="CIN No."
                name="cinNo"
                rules={[
                  {
                    required: true,
                    message: "Please enter CIN No.",
                  },
                ]}
              >
                <Input size="large" block />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={24} lg={8} xl={8}>
              <Form.Item
                label="MSME"
                name="msme"
                rules={[
                  {
                    required: true,
                    message: "Please enter MSME",
                  },
                ]}
              >
                <Input size="large" block />
              </Form.Item>
            </Col>

            <Col
              xs={24}
              sm={24}
              md={24}
              lg={8}
              xl={8}
              style={{ minHeight: 120 }}
            >
              <Form.Item label="Company Logo" name="companyLogo">
                {recordId && !isImgEditable && companyDetails?.imgURL ? (
                  renderCompanyImage()
                ) : (
                  <Upload
                    listType="picture-card"
                    fileList={fileList}
                    onChange={handleChange}
                    beforeUpload={beforeUpload}
                    maxCount={1}
                    accept="image/*"
                    onRemove={() => setFileList([])}
                  >
                    {fileList.length >= 1 ? null : (
                      <div>
                        <BsUpload />
                        <div style={{ marginTop: 8 }}>Upload</div>
                      </div>
                    )}
                  </Upload>
                )}
              </Form.Item>
            </Col>

            <Divider orientation="left">Payment Details</Divider>

            <Col xs={24} sm={24} md={12} lg={6} xl={6}>
              <Form.Item
                label="Bank Name"
                name="paymentDetails.paymentDetails"
                rules={[
                  {
                    required: true,
                    message: "Please enter bank name",
                  },
                ]}
              >
                <Input size="large" block />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={12} lg={6} xl={6}>
              <Form.Item
                label="Branch"
                name="paymentDetails.branch"
                rules={[
                  {
                    required: true,
                    message: "Please enter branch",
                  },
                ]}
              >
                <Input size="large" block />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={12} lg={6} xl={6}>
              <Form.Item
                label="IFS Code"
                name="paymentDetails.ifsCode"
                rules={[
                  {
                    required: true,
                    message: "Please enter IFS code",
                  },
                ]}
              >
                <Input size="large" block />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={12} lg={6} xl={6}>
              <Form.Item
                label="Account Number"
                name="paymentDetails.accountNumber"
                rules={[
                  {
                    required: true,
                    message: "Please enter account number",
                  },
                ]}
              >
                <Input size="large" block />
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
                  loading={isCompanyAdding}
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

export default CompanyForm;
