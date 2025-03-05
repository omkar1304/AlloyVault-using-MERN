import React, { useEffect, useState } from "react";
import verifyToken from "../../../helpers/verifyToken";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useGetAuthenticatedUserQuery } from "../../../redux/api/userApiSlice";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../../redux/features/userSlice";
import { CiStar } from "react-icons/ci";

const MainComponent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { module } = useParams();
  const authenticatedUser = useSelector((store) => store?.user);
  const [menuItems, setMenuItems] = useState([]);

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
              // icon: menuIcons[module.key],
              icon: <CiStar />,
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
        //TODO: add modules
        // const childItem = moduleComponents[child.key];
        if (child?.children?.length > 0) {
          // If there are sub-children, call fetchChildModule recursively
          const subChildren = fetchChildModule(child);
          return {
            key: child.key,
            label: getLabel(child),
            // component: childItem?.component,
            component: <div>{child?.name}</div>,
            // icon: menuIcons[child.key],
            icon: <CiStar />,
            children: subChildren.length > 0 ? subChildren : undefined,
          };
        } else {
          // Create child object if no further children exist
          return {
            key: child.key,
            label: getLabel(child),
            // component: childItem?.component,
            component: <div>{child?.name}</div>,
            // icon: menuIcons[child.key],
            icon: <CiStar />,
          };
        }
      });
  };

  const getLabel = (item) => {
    if (!item?.children || item?.children?.length === 0) {
      return <Link to={"/home/" + item.key}>{item.name}</Link>;
    } else {
      return item.name;
    }
  };

  if (userDataLoading) {
    return <div>Loading...</div>;
  }

  return <div>MainComponent</div>;
};

export default MainComponent;
