import React, { useState } from "react";
import { Layout, Menu } from "antd";
import { useNavigate } from "react-router-dom";
import { PiUsersThreeBold } from "react-icons/pi";
import { GrShieldSecurity } from "react-icons/gr";
import { TbLogs } from "react-icons/tb";
import { AiOutlineHome } from "react-icons/ai";


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

const AdminDrawer = ({ module }) => {
  const [collapsed, setCollapsed] = useState(false);
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
    getItem("Main Portal", "mainPortal", <AiOutlineHome />, null, () =>
        navigate("/home/inward")
      ),
  ];
  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
    >
      <div className="demo-logo-vertical" />
      <Menu
        defaultSelectedKeys={[module]}
        mode="inline"
        items={items}
      />
    </Sider>
  );
};

export default AdminDrawer;
