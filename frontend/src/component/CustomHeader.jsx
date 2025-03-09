import React from "react";
import { Layout, Avatar, Dropdown, Badge, Button, Space } from "antd";
import "../assets/css/customHeader.css";
import { HiOutlineBell } from "react-icons/hi2";
import { IoIosArrowDown, IoIosLogOut } from "react-icons/io";
import { IoSettingsOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import getInitials from "../helpers/getInitials";

const { Header } = Layout;
const items = [
  {
    label: "Settings",
    key: "settings",
    icon: <IoSettingsOutline />,
  },
  {
    label: "Logout",
    key: "logout",
    icon: <IoIosLogOut />,
  },
];
const CustomHeader = () => {
  const authenticatedUser = useSelector((store) => store?.user);

  return (
    <Header className="flex-row-space-between custom-header">
      <Avatar size={40} className="avatar" />

      <div className="flex-row-center right-icons">
        <Badge size="default" count={3}>
          <HiOutlineBell className="icon" size={28} />
        </Badge>

        <Dropdown menu={{ items }} trigger={["click"]}>
          <div className="user-section">
            <Avatar size={32} className="user-avatar">
              {getInitials(authenticatedUser?.displayName || "UU")}
            </Avatar>
            <Button className="dropdown-button">
              <Space>
                <p className="username">
                  {authenticatedUser?.displayName || "Unkown User"}
                </p>
                <IoIosArrowDown
                  size={16}
                  color="#374151"
                  style={{ marginTop: "4px" }}
                />
              </Space>
            </Button>
          </div>
        </Dropdown>
      </div>
    </Header>
  );
};

export default CustomHeader;
