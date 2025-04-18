import React, { useEffect } from "react";
import "../../assets/css/auth.css";
import { PageHeader, PageSubHeader } from "../../component/Headers";
import CustomLogo from "../../component/CustomLogo";
import { Col, Form, Input, Row } from "antd";
import CustomButton from "../../component/CustomButton";
import { Link, useNavigate } from "react-router-dom";
import { useRegisterMutation } from "../../redux/api/user/authApiSlice";
import verifyToken from "../../helpers/verifyToken";
import toast from "react-hot-toast";

const Register = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();

  // If the user is logged in, redirect to the home page
  useEffect(() => {
    if (verifyToken()) {
      navigate("/home/inward");
    }
  }, []);

  const onFinish = async (values) => {
    try {
      const res = await register(values).unwrap();
      localStorage.setItem("token", res?.token);
      toast.success("Registration successful!");
      navigate("/home/inward");
    } catch (error) {
      console.error(error);
      const errMessage = error?.data?.message || "Registration failed!";
      toast.error(errMessage);
    }
  };

  return (
    <section className="flex-col-center full-height">
      <div className="flex-col-center auth-container">
        <div className="flex-col-space-between">
          <CustomLogo />
          <div className="auth-header">
            <PageHeader>Create Account</PageHeader>
            <PageSubHeader>
              Enter your credentials to create an account
            </PageSubHeader>
          </div>
        </div>

        <Form
          style
          form={form}
          disabled={isLoading}
          layout="vertical"
          autoComplete="off"
          name="normal_login"
          onFinish={onFinish}
        >
          <Row gutter={[8]}>
            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
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
                <Input size="large" placeholder="John" block />
              </Form.Item>
            </Col>

            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
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
                <Input size="large" placeholder="Dowry" block />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16]}>
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  {
                    required: true,
                    message: "Please enter a email",
                  },
                  {
                    type: "email",
                    message: "Please enter a valid email",
                  },
                ]}
              >
                <Input
                  size="large"
                  placeholder="john.dowry@example.com"
                  block
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16]}>
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <Form.Item
                label="Password"
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Please input your password",
                  },
                ]}
              >
                <Input.Password size="large" placeholder="Create a password" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16]}>
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <Form.Item
                label="Confirm Password"
                name="confirmPassword"
                dependencies={["password"]}
                rules={[
                  {
                    required: true,
                    message: "Please input your password",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Passwords do not match!")
                      );
                    },
                  }),
                ]}
              >
                <Input.Password size="large" placeholder="Create a password" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16]}>
            <Col
              xs={24}
              sm={24}
              md={24}
              lg={24}
              xl={24}
              style={{ height: "65px" }}
            >
              <Form.Item style={{ marginTop: 16 }}>
                <CustomButton
                  isLoading={isLoading}
                  htmlType="submit"
                  width="100%"
                  size="large"
                >
                  Create Account
                </CustomButton>
              </Form.Item>
            </Col>
          </Row>
        </Form>

        <span className="auth-link-span">
          Already have an account?{" "}
          <Link to="/login" className="auth-link">
            Log in
          </Link>
        </span>
      </div>
    </section>
  );
};

export default Register;
