import React, { useState } from "react";
import { Layout, Menu } from "antd";
import { useNavigate } from "react-router-dom";
import { PiUsersThreeBold } from "react-icons/pi";
import { GrShieldSecurity } from "react-icons/gr";
import { TbLogs } from "react-icons/tb";
import { AiOutlineHome } from "react-icons/ai";
import { MdOutlineMarkEmailRead, MdOutlineGrade } from "react-icons/md";
import { IoGitBranchOutline, IoOptionsSharp } from "react-icons/io5";
import { SiMaterialformkdocs } from "react-icons/si";
import { VscSymbolClass } from "react-icons/vsc";
import { GoOrganization } from "react-icons/go";
import { LuShapes } from "react-icons/lu";

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
    getItem("Company", "company", <GoOrganization />, null, () =>
      navigate("/admin/company")
    ),
    getItem(
      "Options",
      "options",
      <IoOptionsSharp />,
      [
        getItem("Branch", "branch", <IoGitBranchOutline />, null, () =>
          navigate("/admin/branch")
        ),
        getItem(
          "Inward Type",
          "inwardType",
          <SiMaterialformkdocs />,
          null,
          () => navigate("/admin/inwardType")
        ),
        getItem(
          "Material Type",
          "materialType",
          <VscSymbolClass />,
          null,
          () => navigate("/admin/materialType")
        ),
        getItem("Grade", "grade", <MdOutlineGrade />, null, () =>
          navigate("/admin/grade")
        ),
        getItem("Party Type", "partyType", <GoOrganization />, null, () =>
          navigate("/admin/partyType")
        ),
        getItem("Shape", "shape", <LuShapes />, null, () =>
          navigate("/admin/shape")
        ),
      ],
      null
    ),
    getItem("Activity Logs", "activityLogs", <TbLogs />, null, () =>
      navigate("/admin/activityLogs")
    ),
    getItem("Email Logs", "emailLogs", <MdOutlineMarkEmailRead />, null, () =>
      navigate("/admin/emailLogs")
    ),
    getItem("Main Portal", "mainPortal", <AiOutlineHome />, null, () =>
      navigate(import.meta.env.VITE_INITIAL_ROUTE)
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
