import React from "react";
import "../assets/css/header.css"

export const PageHeader = ({ children }) => {
  return <p className="page-header">{children}</p>;
};

export const PageSubHeader = ({ children }) => {
  return <p className="page-sub-header">{children}</p>;
};


