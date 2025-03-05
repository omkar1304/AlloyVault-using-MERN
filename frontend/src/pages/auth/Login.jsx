import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form, Input, message } from "antd";
import { useLoginMutation } from "../../redux/api/userApiSlice";
import verifyToken from "../../helpers/verifyToken";

const Login = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();

  // If the user is logged in, redirect to the home page
  useEffect(() => {
    if (verifyToken()) {
      navigate("/");
    }
  }, []);

  const onFinish = async (values) => {
    try {
      const res = await login(values).unwrap();
      localStorage.setItem("token", res?.token);
      messageApi.success("Login successful!");
      navigate("/");
    } catch (error) {
      console.error(error);
      messageApi.error("Login failed!");
    }
  };


  return (
    <div>
      <h1>Login Page</h1>
      <Form
        disabled={isLoading}
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          label="email"
          name="email"
          rules={[
            {
              required: true,
              message: "Please input your email!",
            },
            {
              type: "email",
              message: "Please enter valid email!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item label={null}>
          <Button loading={isLoading} type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
