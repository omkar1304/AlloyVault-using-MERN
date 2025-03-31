import React, { useEffect } from "react";
import { Result } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { ModuleComponents } from "./ModuleComponent";
import CustomResult from "../../../component/CustomResult";
import { useNavigate } from "react-router-dom";
import { useGetAuthenticatedUserQuery } from "../../../redux/api/user/authApiSlice";
import { setUser } from "../../../redux/features/userSlice";

const Main = ({ module }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authenticatedUser = useSelector((store) => store?.user);
  const moduleConfig = ModuleComponents[module];
  const {
    data: userData,
    isSuccess: isUserDataSuccess,
    isLoading: userDataLoading,
  } = useGetAuthenticatedUserQuery();

  useEffect(() => {
    if (isUserDataSuccess && userData) {
      dispatch(setUser(userData));
    }
    if (userData && !userData?.isAdminApproved) {
      return navigate("/onboarding");
    }
  }, [userData]);

  // If no module found from module component then provide 404 template
  if (!moduleConfig) {
    return <CustomResult statusCode={404} />;
  }

  const {
    component: Component,
    index = undefined,
    parentIndex = undefined,
    pageTitle = "",
    childIndex,
  } = moduleConfig;

  //* Conditions to check permissions
  //? 1. If user doesnt have perms then no permissions
  //? 2. If that module doesn't have its own index then no permissions
  //? 3. If that module has index but doesn't have parent index, then check if that index has access if false then no permissions
  //? 4. If that module has index and parent index, then check parent index has access and index has access, if any one is false then no permissions

  const userPerms = authenticatedUser?.perms;
  const parentData = parentIndex ? userPerms?.[parentIndex] : null;
  const currentData = parentIndex
    ? parentData?.children?.[index]
    : userPerms?.[index];

  if (
    !userPerms || // No permissions
    (parentData && parentData.children && !parentData.access) || // has parent data but no access
    (!parentData && !currentData) || // no parent data and current data
    (!parentData && currentData && !currentData.access) || // no parent data but has current data but no access
    (parentData && currentData && !currentData.access) // no parent data and current data but current data has no access
  ) {
    return <CustomResult statusCode={403} />;
  }

  return <Component />;
};

export default Main;
