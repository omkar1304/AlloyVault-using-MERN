import React, { useState } from "react";
import { Layout, Menu } from "antd";
import { useNavigate } from "react-router-dom";
import { PiUsersThreeBold } from "react-icons/pi";
import { GrShieldSecurity } from "react-icons/gr";
import { TbLogs } from "react-icons/tb";
import { AiOutlineHome } from "react-icons/ai";
import { MdOutlineMarkEmailRead } from "react-icons/md";

const { Sider } = Layout;

const getItem = (label, key, icon, children, onClick = () => {}) => {
  return {
    key,
    icon,
    children,
    label,
    onClick,
  };
};

const AdminDrawer = ({ module, collapsed, setCollapsed }) => {
  
  const navigate = useNavigate();
  const items = [
    getItem("Users", "users", <PiUsersThreeBold />, null, () =>
      navigate("/admin/users")
    ),
    getItem("Roles", "roles", <GrShieldSecurity />, null, () =>
      navigate("/admin/roles")
    ),
    getItem("Activity Logs", "activityLogs", <TbLogs />, null, () =>
      navigate("/admin/activityLogs")
    ),
    getItem("Email Logs", "emailLogs", <MdOutlineMarkEmailRead />, null, () =>
      navigate("/admin/emailLogs")
    ),
    getItem("Main Portal", "mainPortal", <AiOutlineHome />, null, () =>
      navigate("/home/inward")
    ),
  ];
  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      style={{
        position: "fixed",
        left: 0,
        height: "calc(100vh - 64px)",
        overflowY: "auto",
        backgroundColor: "white",
        borderRight: "1px solid #E5E7EB",
        zIndex: 999,
      }}
    >
      <div className="demo-logo-vertical" />
      <Menu defaultSelectedKeys={[module]} mode="inline" items={items} />
    </Sider>
  );
};

export default AdminDrawer;
