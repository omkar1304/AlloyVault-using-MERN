import React from "react";
import ChallanList from "./ChallanList";
import { useParams } from "react-router-dom";
import ChallanPreview from "./ChallanPreview";

const ChallanGeneration = () => {
  const { id } = useParams();

  if (id && id === "preview") return <ChallanPreview />;
  else return <ChallanList />;
};

export default ChallanGeneration;
