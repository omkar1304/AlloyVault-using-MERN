import React, { useEffect } from "react";
import CustomResult from "../../component/CustomResult";
import { useDispatch, useSelector } from "react-redux";
import { useGetAuthenticatedUserQuery } from "../../redux/api/user/authApiSlice";
import { setUser } from "../../redux/features/userSlice";
import { useNavigate } from "react-router-dom";

const InActivePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authenticatedUser = useSelector((store) => store?.user);
  const {
    data: userData,
    isSuccess: isUserDataSuccess,
    isLoading: userDataLoading,
    isError,
  } = useGetAuthenticatedUserQuery();

  useEffect(() => {
    if (isUserDataSuccess) {
      dispatch(setUser(userData));
    }
  }, [userData]);

  if (authenticatedUser.isAdminApproved) {
    return navigate("/home/inward");
  }
  return <CustomResult statusCode={403} />;
};

export default InActivePage;
