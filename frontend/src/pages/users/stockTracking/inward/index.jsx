import React from "react";
import { useParams } from "react-router-dom";
import InwardForm from "./InwardForm";
import InwardList from "./InwardList";

const Inward = () => {
  const { id } = useParams();

  if (id && (id === "new" || id === "edit")) return <InwardForm />;
  else return <InwardList />;
};

export default Inward;
