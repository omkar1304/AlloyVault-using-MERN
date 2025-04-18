import React, { useEffect } from "react";
import "../../assets/css/auth.css";
import { Link, useNavigate } from "react-router-dom";
import { PageHeader, PageSubHeader } from "../../component/Headers";
import CustomLogo from "../../component/CustomLogo";
import CustomButton from "../../component/CustomButton";
import { Form, Input, Col, Row } from "antd";
import verifyToken from "../../helpers/verifyToken";
import { toast } from "react-hot-toast";
import { useLoginMutation } from "../../redux/api/user/authApiSlice";

const Login = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();

  // If the user is logged in, redirect to the home page
  useEffect(() => {
    if (verifyToken()) {
      navigate(import.meta.env.VITE_INITIAL_ROUTE);
    }
  }, []);

  const onFinish = async (values) => {
    try {
      const res = await login(values).unwrap();
      localStorage.setItem("token", res?.token);
      toast.success("Login successful!");
      navigate(import.meta.env.VITE_INITIAL_ROUTE);
    } catch (error) {
      console.error(error);
      toast.error("Login failed!");
    }
  };

  return (
    <section className="flex-col-center full-height">
      <div className="flex-col-center auth-container">
        <div className="flex-col-space-between">
          <CustomLogo />
          <div className="auth-header">
            <PageHeader>Login to your account</PageHeader>
            <PageSubHeader>
              Enter your details to access your account
            </PageSubHeader>
          </div>
        </div>

        <Form
          form={form}
          disabled={isLoading}
          layout="vertical"
          autoComplete="off"
          name="normal_login"
          className="full-width"
          onFinish={onFinish}
        >
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
                    message: "Please enter a valid email!",
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
            <Col
              xs={24}
              sm={24}
              md={24}
              lg={24}
              xl={24}
              style={{ height: "75px" }}
            >
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
                <Input.Password size="large" placeholder="**********" />
              </Form.Item>
            </Col>
          </Row>
          <Link to="/resetPassword" className="auth-forgot-password">
            Forgot Password?
          </Link>
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
                  Login
                </CustomButton>
              </Form.Item>
            </Col>
          </Row>
        </Form>

        <span className="auth-link-span">
          No account yet?{" "}
          <Link to="/register" className="auth-link">
            Create an account
          </Link>
        </span>
      </div>
    </section>
  );
};

export default Login;
