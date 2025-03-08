import React, { useEffect } from "react";
import { Layout, Result } from "antd";
import verifyToken from "../../../helpers/verifyToken";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../../redux/features/userSlice";
import Users from "./../users/index";
import Roles from "./../roles/index";
import ActivityLogs from "./../activityLogs/index";
import AdminDrawer from "./AdminDrawer";
import { useGetAuthenticatedUserQuery } from "../../../redux/api/userApiSlice";

const { Header, Content, Footer, Sider } = Layout;

const adminModule = {
  users: <Users />,
  roles: <Roles />,
  activityLogs: <ActivityLogs />,
};

const AdminComponent = () => {
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
      <Result
        status="404"
        title="Page not found"
        subTitle="Sorry, the page you're looking for does not exist"
      />
    );
  };

  return (
    <Layout
      style={{
        minHeight: "100vh",
        backgroundColor: "white",
      }}
    >
      <Header
        style={{
          padding: 0,
        }}
      />

      <Layout>
        <AdminDrawer module={module} />
        <Content className="main-content">
          <Main module={module} />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminComponent;
