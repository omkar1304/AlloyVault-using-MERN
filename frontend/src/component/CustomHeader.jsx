import React from "react";
import { Layout, Avatar, Dropdown, Badge, Button, Space } from "antd";
import "../assets/css/customHeader.css";
import { HiOutlineBell } from "react-icons/hi2";
import { IoIosArrowDown, IoIosLogOut } from "react-icons/io";
import { IoSettingsOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import getInitials from "../helpers/getInitials";
import { useLogoutMutation } from "../redux/api/user/authApiSlice";
import Cookies from "universal-cookie";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import LOGO from "../assets/images/logo/company.svg";

const { Header } = Layout;
const cookies = new Cookies();

const CustomHeader = () => {
  const navigate = useNavigate();
  const authenticatedUser = useSelector((store) => store?.user);
  const [logout, {}] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("You have been logged out successfully.");
      localStorage.clear();
      cookies.remove("jwt", { path: "/" });
      navigate("/login");
    } catch (error) {
      console.error(error);
      toast.error("Failed to log out. Please try again later.");
    }
  };

  const items = [
    {
      label: <p>Settings</p>,
      key: "settings",
      icon: <IoSettingsOutline />,
    },
    {
      label: <p onClick={handleLogout}>Logout</p>,
      key: "logout",
      icon: <IoIosLogOut />,
    },
  ];

  return (
    <Header className="flex-row-space-between custom-header">
      <img src={LOGO} alt="logo" style={{ marginInline: "4px" }} />

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
                  color="#FFF"
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
