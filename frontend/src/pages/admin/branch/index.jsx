import React from "react";
import { useParams } from "react-router-dom";
import BranchList from "./BranchList";
import BranchForm from "./BranchForm";

const Branch = () => {
  const { id } = useParams();

  if (id && (id === "new" || id === "edit")) return <BranchForm />;
  else return <BranchList />;
};

export default Branch;
