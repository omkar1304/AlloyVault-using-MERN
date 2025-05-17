import React from "react";
import { useParams } from "react-router-dom";
import TransportForm from "./TransportForm";
import TransportList from "./TransportList";

const TransportDetails = () => {
  const { id } = useParams();

  if (id && (id === "new" || id === "edit")) return <TransportForm />;
  else return <TransportList />;
};

export default TransportDetails;
