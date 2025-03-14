import React from "react";
import "../assets/css/customResult.css";
import { Link } from "react-router-dom";
import InActiveImg from "../assets/images/results/100.svg";
import NotFoundImg from "../assets/images/results/404.svg";
import AccessDeinedImg from "../assets/images/results/403.svg";
import ServerErrorImg from "../assets/images/results/500.svg";
import NoDataImg from "../assets/images/results/noData.svg";
import { Button } from "antd";
import CustomButton from "./CustomButton";
import { SendIcon } from "./ActionComponent";

const handleRefresh = () => {
  window.location.reload();
};

const CustomResult = ({ statusCode }) => {
  let resultImg = null;
  let resultHeading = null;
  let resultSubheading = null;
  let resultTroubleshoot = null;
  let resultActionButton = null;

  switch (statusCode) {
    case 100:
      resultImg = InActiveImg;
      resultHeading = "Access Pending Approval";
      resultSubheading =
        "Your account is under review. The admin will assign you to a branch shortly.";
      resultActionButton = (
        <CustomButton style={{ marginTop: "5px" }} type="primary">
          Notify Admin
        </CustomButton>
      );
      break;
    case 404:
      resultImg = NotFoundImg;
      resultHeading = "Page Not Found";
      resultSubheading = "Sorry, the page you visited does not exist.";
      resultTroubleshoot = <Link to={"/home/inward"}>Back to Home</Link>;
      break;
    case 403:
      resultImg = AccessDeinedImg;
      resultHeading = "Access Restricted";
      resultSubheading = "Access denied! Contact your admin for permission.";
      resultTroubleshoot = (
        <Link onClick={handleRefresh}>Refresh the page</Link>
      );
      break;
    case 500:
      resultImg = ServerErrorImg;
      resultHeading = "Internal Server Error";
      resultSubheading =
        "System glitch! Our engineers are on it—please retry soon.";
      resultTroubleshoot = (
        <Link onClick={handleRefresh}>Refresh the page</Link>
      );
      break;
    default:
      resultImg = NoDataImg;
      resultHeading = "No Data Found!";
      resultSubheading =
        "Try adjusting your filters or adding new entries to see data here.";
      resultTroubleshoot = (
        <Link onClick={handleRefresh}>Refresh the page</Link>
      );
      break;
  }

  return (
    <section className="custom-result-container flex-col-center">
      <img className="custom-result-img" src={resultImg} alt="Page Not Found" />
      <h1 className="custom-result-heading">{resultHeading}</h1>
      <p className="custom-result-subheading">
        {resultSubheading}
        {resultTroubleshoot}
      </p>
      {resultActionButton && resultActionButton}
    </section>
  );
};

export default CustomResult;
