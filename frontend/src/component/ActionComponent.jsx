import { FaEye, FaRegEdit, FaRegEye, FaRegTrashAlt } from "react-icons/fa";
import { FiPlus } from "react-icons/fi";
import { IoSearchOutline } from "react-icons/io5";
import { IoIosSend } from "react-icons/io";
import { MdLockReset, MdEdit } from "react-icons/md";
import { HiOutlineMailOpen } from "react-icons/hi";
import { GrShieldSecurity } from "react-icons/gr";
import { LuEye } from "react-icons/lu";


const iconStyle = {
  cursor: "pointer",
};

export const AddIcon = ({ size = 20, color = "#1F2937", ...rest }) => (
  <FiPlus style={{ ...iconStyle }} size={size} color={color} {...rest} />
);
export const EditIcon = ({ size = 20, color = "#1F2937", ...rest }) => (
  <FaRegEdit style={{ ...iconStyle }} size={size} color={color} {...rest} />
);

export const ViewIcon = ({ size = 20, color = "#1F2937", ...rest }) => (
  <LuEye  style={{ ...iconStyle }} size={size} color={color} {...rest} />
);

export const EditFieldIcon = ({ size = 20, color = "#1F2937", ...rest }) => (
  <MdEdit style={{ ...iconStyle }} size={size} color={color} {...rest} />
);

export const DeleteIcon = ({ size = 20, color = "#1F2937", ...rest }) => (
  <FaRegTrashAlt style={{ ...iconStyle }} size={size} color={color} {...rest} />
);
export const SendIcon = ({ size = 20, color = "#1F2937", ...rest }) => (
  <IoIosSend style={{ ...iconStyle }} size={size} color={color} {...rest} />
);
export const SearchIcon = ({ size = 20, color = "#1F2937", ...rest }) => (
  <IoSearchOutline
    style={{ ...iconStyle }}
    size={size}
    color={color}
    {...rest}
  />
);

export const ResetIcon = ({ size = 20, color = "#1F2937", ...rest }) => (
  <MdLockReset style={{ ...iconStyle }} size={size} color={color} {...rest} />
);

export const EmailOpenIcon = ({ size = 20, color = "#1F2937", ...rest }) => (
  <HiOutlineMailOpen
    style={{ ...iconStyle }}
    size={size}
    color={color}
    {...rest}
  />
);

export const SecurityIcon = ({ size = 20, color = "#1F2937", ...rest }) => (
  <GrShieldSecurity
    style={{ ...iconStyle }}
    size={size}
    color={color}
    {...rest}
  />
);
