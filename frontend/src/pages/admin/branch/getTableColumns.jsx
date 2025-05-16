import { Avatar, Popconfirm, Tag, Tooltip } from "antd";
import { DeleteIcon, EditIcon } from "../../../component/ActionComponent";
import getFormattedDate from "../../../helpers/getFormattedDate";
import { useNavigate } from "react-router-dom";
import { FaExclamation } from "react-icons/fa6";
import getInitials from "../../../helpers/getInitials";

const getTableColumns = ({ handleDeleteBranch }) => {
  const navigate = useNavigate();
  return [
    {
      title: "Company Name",
      dataIndex: "name",
      width: 150,
      render: (x) => x,
    },
    {
      title: "Prefix",
      dataIndex: "prefix",
      width: 100,
      render: (x) => x,
    },
    {
      title: "Created Date",
      dataIndex: "createdAt",
      width: 100,
      render: (x) => x && getFormattedDate(x, true),
    },
    {
      title: "Done By",
      dataIndex: "createdBy",
      width: 100,
      render: (x) => (
        <Tooltip title={x}>
          <Avatar
            size={28}
            style={{ backgroundColor: "#111827", cursor: "pointer" }}
          >
            {getInitials(x)}
          </Avatar>
        </Tooltip>
      ),
    },
    {
      title: "Actions",
      width: 50,
      render: (row) => (
        <div className="flex-row-start">
          <Tooltip title="Edit">
            <EditIcon
              onClick={() =>
                navigate(`/admin/branch/edit?recordId=${row?._id}`)
              }
            />
          </Tooltip>
          <Popconfirm
            title="Delete the branch"
            description="Are you sure to delete?"
            onConfirm={() => handleDeleteBranch(row?._id)}
            onCancel={null}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Delete">
              <DeleteIcon />
            </Tooltip>
          </Popconfirm>
        </div>
      ),
    },
  ];
};

export default getTableColumns;
