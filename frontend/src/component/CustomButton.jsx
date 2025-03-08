import { Button } from "antd";
import "../assets/css/customButton.css";
import React from "react";

const CustomButton = ({
  type = "primary",
  children,
  label,
  isLoading = false,
  icon = null,
  ...rest
}) => {
  return (
    <Button
      className={`custom-button ${
        type === "primary" ? "primary-button" : "secondary-button"
      }`}
      loading={isLoading}
      icon={icon}
      {...rest}
    >
      {children}
    </Button>
  );
};

export default CustomButton;
