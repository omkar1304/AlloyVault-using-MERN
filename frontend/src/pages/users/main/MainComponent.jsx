import React, { useEffect, useState } from "react";
import { Layout, Menu } from "antd";
import verifyToken from "../../../helpers/verifyToken";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useGetAuthenticatedUserQuery } from "../../../redux/api/userApiSlice";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../../redux/features/userSlice";
import { CiStar } from "react-icons/ci";
import { MenuComponents } from "./MenuComponent";
import { ModuleComponents } from "./ModuleComponent";
import Main from "./Main";

const { Header, Content, Footer, Sider } = Layout;

const MainComponent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { module } = useParams();
  const authenticatedUser = useSelector((store) => store?.user);
  const [menuItems, setMenuItems] = useState([]);
  const [collapsed, setCollapsed] = useState(false);

  const {
    data: userData,
    isSuccess: isUserDataSuccess,
    isLoading: userDataLoading,
    isError,
  } = useGetAuthenticatedUserQuery();

  useEffect(() => {
    if (!verifyToken()) {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    if (isUserDataSuccess) {
      dispatch(setUser(userData));
    }
  }, [userData]);

  useEffect(() => {
    if (
      authenticatedUser?.isAuthenticated &&
      authenticatedUser?.perms?.length
    ) {
      const menuItems = authenticatedUser?.perms
        ?.map((module) => {
          if (module?.access) {
            const children = module?.children?.length
              ? fetchChildModule(module)
              : undefined;

            let moduleObj = {
              key: module.key,
              label: getLabel(module),
              children,
              icon: MenuComponents[module.key],
            };

            return moduleObj;
          }
          return null;
        })
        .filter(Boolean);

      setMenuItems(menuItems);
    }
  }, [authenticatedUser]);

  const fetchChildModule = (module) => {
    return module?.children
      ?.filter((child) => child?.access)
      .map((child) => {
        const childItem = ModuleComponents[child.key];
        if (child?.children?.length > 0) {
          // If there are sub-children, call fetchChildModule recursively
          const subChildren = fetchChildModule(child);
          return {
            key: child.key,
            label: getLabel(child),
            component: childItem?.component,
            icon: MenuComponents[child.key],
            children: subChildren.length > 0 ? subChildren : undefined,
          };
        } else {
          // Create child object if no further children exist
          return {
            key: child.key,
            label: getLabel(child),
            component: childItem?.component,
            icon: MenuComponents[child.key],
          };
        }
      });
  };

  const getLabel = (item) => {
    // If admin portal, then redirect to admin portal
    if (item.key === "adminSettings") {
      return <Link to={"/admin/users"}>{item.name}</Link>;
    }
    // if not admin but also dont have children, then redirect to current module
    else if (!item?.children || item?.children?.length === 0) {
      return <Link to={"/home/" + item.key}>{item.name}</Link>;
    }
    // else just return the name to avoid parent module redirect
    else {
      return item.name;
    }
  };

  if (userDataLoading) {
    return <div>Loading...</div>;
  }


  return (
    <Layout
      style={{
        minHeight: "100vh",
      }}
    >
      <Header
        style={{
          padding: 0,
        }}
      />

      <Layout>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
        >
          <div className="demo-logo-vertical" />
          <Menu defaultSelectedKeys={[module]} theme="light" mode="inline" items={menuItems} />
        </Sider>
        <Main module={module} />
        {/* <Footer
          style={{
            textAlign: "center",
          }}
        >
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer> */}
      </Layout>
    </Layout>
  );
};

export default MainComponent;
