import { FaRegEdit, FaRegTrashAlt } from "react-icons/fa";
import { FiPlus } from "react-icons/fi";
import { IoSearchOutline } from "react-icons/io5";

const iconStyle = {
  cursor: "pointer",
};

export const AddIcon = ({ size = 20, color = "#1F2937", ...rest }) => (
  <FiPlus style={{ ...iconStyle }} size={size} color={color} {...rest} />
);
export const EditIcon = ({ size = 20, color = "#1F2937", ...rest }) => (
  <FaRegEdit style={{ ...iconStyle }} size={size} color={color} {...rest} />
);
export const DeleteIcon = ({ size = 20, color = "#1F2937", ...rest }) => (
  <FaRegTrashAlt style={{ ...iconStyle }} size={size} color={color} {...rest} />
);

export const SearchIcon = ({ size = 20, color = "#1F2937", ...rest }) => (
  <IoSearchOutline
    style={{ ...iconStyle }}
    size={size}
    color={color}
    {...rest}
  />
);
