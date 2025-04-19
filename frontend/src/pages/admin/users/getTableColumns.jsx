import { Tooltip } from "antd";
import { EditIcon } from "../../../component/ActionComponent";
import getFormattedDate from "../../../helpers/getFormattedDate";
import { useNavigate } from "react-router-dom";
import { FaExclamation } from "react-icons/fa6";

const getTableColumns = ({}) => {
  const navigate = useNavigate();
  return [
    {
      title: "Name",
      dataIndex: "displayName",
      width: 150,
      render: (x, row) =>
        !row?.isAdminApproved ? (
          <Tooltip title="Approval Pending">
            <FaExclamation color="#FF8080" style={{ cursor: "pointer" }} />
            {x}
          </Tooltip>
        ) : (
          x
        ),
    },
    {
      title: "Created Date",
      dataIndex: "createdAt",
      width: 150,
      render: (x) => x && getFormattedDate(x, true),
    },
    {
      title: "Email",
      dataIndex: "email",
      width: 150,
      render: (x) => x,
    },
    {
      title: "Role",
      dataIndex: "roleName",
      width: 150,
      render: (x) => x,
    },

    {
      title: "Actions",
      width: 50,
      render: (row) => (
        <Tooltip title="Edit">
          <EditIcon
            onClick={() => navigate(`/admin/users/edit?recordId=${row?._id}`)}
          />
        </Tooltip>
      ),
    },
  ];
};

export default getTableColumns;
