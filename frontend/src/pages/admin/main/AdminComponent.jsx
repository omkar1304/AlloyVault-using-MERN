import React, { useEffect, useState } from "react";
import { Layout, Result } from "antd";
import verifyToken from "../../../helpers/verifyToken";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../../redux/features/userSlice";
import Users from "./../users/index";
import Roles from "./../roles/index";
import ActivityLogs from "./../activityLogs/index";
import AdminDrawer from "./AdminDrawer";
import { Toaster } from "react-hot-toast";
import CustomHeader from "../../../component/CustomHeader";
import CustomResult from "../../../component/CustomResult";
import { useGetAuthenticatedUserQuery } from "../../../redux/api/user/authApiSlice";

const { Content } = Layout;

const adminModule = {
  users: <Users />,
  roles: <Roles />,
  activityLogs: <ActivityLogs />,
};

const AdminComponent = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { module } = useParams();
  const authenticatedUser = useSelector((store) => store?.user);

  const {
    data: userData,
    isSuccess: isUserDataSuccess,
    isLoading: userDataLoading,
    isError,
  } = useGetAuthenticatedUserQuery();

  useEffect(() => {
    // If the user is not logged in, redirect to the login page
    if (!verifyToken()) {
      return navigate("/login");
    }
  }, []);

  useEffect(() => {
    if (isUserDataSuccess) {
      dispatch(setUser(userData));
    }

    // If the user is not an admin, redirect to the home page
    if (userData && !/super admin/i.test(userData?.roleName)) {
      return navigate("/home/inward");
    }
  }, [userData]);

  const Main = ({ module }) => {
    return adminModule[module] ? (
      adminModule[module]
    ) : (
      <CustomResult statusCode={404} />
    );
  };

  return (
    <Layout className="outer-layout">
      <Toaster />
      <CustomHeader />
      <Layout
        style={{
          marginLeft: collapsed ? "80px" : "200px",
          marginTop: "64px",
          transition: "margin-left 0.3s ease-in-out",
        }}
      >
        <AdminDrawer
          module={module}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />
        <Content className="main-content">
          <Main module={module} />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminComponent;
