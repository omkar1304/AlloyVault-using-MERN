import React from "react";
import OutwardForm from "./OutwardForm";
import OutwardList from "./OutwardList";
import OutwardPreview from "./OutwardPreview";
import { useParams } from "react-router-dom";

const Outward = () => {
  const { id } = useParams();

  if (id && (id === "new" || id === "edit")) return <OutwardForm />;
  else if (id && id === "preview") return <OutwardPreview />;
  else return <OutwardList />;
};

export default Outward;
