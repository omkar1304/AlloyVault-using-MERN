import React, { useState, useEffect } from "react";
import { Input, Button, Steps, Form, message } from "antd";
import {
  useSendOTPMutation,
  useVerifyOTPMutation,
  useResetPasswordMutation,
} from "../../redux/api/user/authApiSlice";
import toast from "react-hot-toast";
import "../../assets/css/auth.css";
import {
  EmailOpenIcon,
  ResetIcon,
  SecurityIcon,
} from "../../component/ActionComponent";
import { PageHeader, PageSubHeader } from "../../component/Headers";
import CustomButton from "../../component/CustomButton";
import { Link, useNavigate } from "react-router-dom";
import { MdKeyboardArrowLeft } from "react-icons/md";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [sendOTP, { isLoading: isOTPsending }] = useSendOTPMutation();
  const [verifyOTP, { isLoading: isOTPverifying }] = useVerifyOTPMutation();
  const [resetPassword, { isLoading: isPasswordResetting }] =
    useResetPasswordMutation();

  useEffect(() => {
    sessionStorage.setItem("forgotPasswordStep", step);
  }, [step]);

  useEffect(() => {
    const savedStep = sessionStorage.getItem("forgotPasswordStep");
    if (savedStep) setStep(Number(savedStep));
  }, []);

  const handleSendOtp = async () => {
    if (!email) return toast.error("Please enter your email");
    try {
      await sendOTP({ email }).unwrap();
      toast.success("OTP sent successfully");
      setStep(1);
    } catch (error) {
      console.error(error);
      const errMessage = error?.data?.message || "Couldn't send OTP";
      toast.error(errMessage);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) return toast.error("Please enter the OTP");
    try {
      await verifyOTP({ email, otp }).unwrap();
      toast.success("OTP verified successfully");
      setStep(2);
    } catch (error) {
      console.error(error);
      const errMessage = error?.data?.message || "Couldn't verify OTP";
      toast.error(errMessage);
    }
  };

  const handleResetPassword = async () => {
    if (!password || !confirmPassword) {
      return toast.error("Please enter both password and confirm password");
    }

    if (password.trim().length < 6) {
      return toast.error("Password should be at least 6 characters long");
    }

    if (password.trim() !== confirmPassword.trim()) {
      return toast.error("Password and Confirm password should match");
    }

    try {
      await resetPassword({ email, password: password.trim() }).unwrap();
      toast.success("Password updated successfully");
      sessionStorage.removeItem("forgotPasswordStep");
      navigate("/login");
    } catch (error) {
      console.error(error);
      const errMessage = error?.data?.message || "Couldn't update password";
      toast.error(errMessage);
    }
  };

  return (
    <section className="flex-col-center full-height">
      <div className="flex-col-center reset-password-container">
        <Steps size="small" current={step}>
          <Steps.Step title="Enter Email" icon={<ResetIcon size={22} />} />
          <Steps.Step title="Verify OTP" icon={<EmailOpenIcon size={22} />} />
          <Steps.Step
            title="Update Password"
            icon={<SecurityIcon size={22} />}
          />
        </Steps>

        <div>
          {step === 0 && (
            <div className="flex-col-center">
              <div className="reset-password-header">
                <PageHeader>Reset your password</PageHeader>
                <PageSubHeader>
                  Enter your email address associated with your account and will
                  send you an email instruction to reset
                </PageSubHeader>
              </div>
              <Form
                className="full-width"
                layout="vertical"
                disabled={isOTPsending}
              >
                <Form.Item
                  label="Email"
                  rules={[
                    {
                      required: true,
                      message: "Please enter a email",
                    },
                    {
                      type: "email",
                      message: "Please valid email",
                    },
                  ]}
                >
                  <Input
                    size="large"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john.dowry@example.com"
                  />
                </Form.Item>
                <CustomButton
                  size="large"
                  isLoading={isOTPsending}
                  type="primary"
                  onClick={handleSendOtp}
                  block
                >
                  Send OTP
                </CustomButton>
              </Form>
              <div className="flex-row-center">
                <MdKeyboardArrowLeft size={18}/>
                <Link className="reset-password-login" to="/login">
                  Back to login
                </Link>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="flex-col-center">
              <div className="reset-password-header">
                <PageHeader>Password recovery code</PageHeader>
                <PageSubHeader>
                  We sent a 6-digit password recovery code to your email. Enter
                  the code to proceed
                </PageSubHeader>
              </div>
              <Form
                disabled={isOTPverifying}
                className="full-width"
                layout="vertical"
              >
                <Form.Item label="" className="flex-row-center">
                  <Input.OTP
                    size="large"
                    value={otp}
                    length={6}
                    onChange={(value) => setOtp(value)}
                  />
                </Form.Item>
                <CustomButton
                  size="large"
                  isLoading={isOTPverifying}
                  type="primary"
                  onClick={handleVerifyOtp}
                  block
                >
                  Verify OTP
                </CustomButton>
              </Form>
            </div>
          )}

          {step === 2 && (
            <div className="flex-col-center">
              <div className="reset-password-header">
                <PageHeader>Create a new password</PageHeader>
                <PageSubHeader>
                  Your new password must be different from your current password
                  for security reasons.
                </PageSubHeader>
              </div>

              <Form
                className="full-width"
                layout="vertical"
                disabled={isPasswordResetting}
              >
                <Form.Item label="New Password">
                  <Input.Password
                    size="large"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="********"
                  />
                </Form.Item>

                <Form.Item label="Confirm New Password">
                  <Input.Password
                    size="large"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="********"
                  />
                </Form.Item>

                <CustomButton
                  size="large"
                  isLoading={isPasswordResetting}
                  type="primary"
                  onClick={handleResetPassword}
                  block
                >
                  Update Password
                </CustomButton>
              </Form>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ResetPassword;
