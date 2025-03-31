import React from "react";
import { useParams } from "react-router-dom";
import CompanyForm from "./CompanyForm";
import CompanyList from "./CompanyList";

const CompanyDetails = () => {
  const { id } = useParams();

  if (id && (id === "new" || id === "edit")) return <CompanyForm />;
  else return <CompanyList />;
};

export default CompanyDetails;
