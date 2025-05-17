import { useParams } from "react-router-dom";
import BTForm from "./BTForm";
import BTList from "./BTList";

const BranchTransfer = () => {
  const { id } = useParams();

  if (id && (id === "new" || id === "edit")) return <BTForm />;
  else return <BTList />;
};

export default BranchTransfer;
