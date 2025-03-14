import React from "react";
import { Toaster } from "react-hot-toast";
import { Outlet } from "react-router-dom";

const Auth = () => {
  return (
    <div>
      <Toaster />
      <Outlet />
    </div>
  );
};

export default Auth;
