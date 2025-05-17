import { Avatar, Popconfirm, Tag, Tooltip } from "antd";
import { DeleteIcon, EditIcon } from "../../../component/ActionComponent";
import getFormattedDate from "../../../helpers/getFormattedDate";
import { useNavigate } from "react-router-dom";
import { FaExclamation } from "react-icons/fa6";
import getInitials from "../../../helpers/getInitials";

const getTableColumns = ({ handleDeleteTransport }) => {
  const navigate = useNavigate();
  return [
    {
      title: "Transport Name",
      dataIndex: "name",
      width: 150,
      render: (x) => x,
    },
    {
      title: "Transport Id.",
      dataIndex: "transportId",
      width: 100,
      render: (x) => x,
    },
    {
      title: "Contact No.",
      dataIndex: "mobile",
      width: 100,
      render: (x) => x,
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
                navigate(`/home/transportDetails/edit?recordId=${row?._id}`)
              }
            />
          </Tooltip>
          <Popconfirm
            title="Delete the transport"
            description="Are you sure to delete?"
            onConfirm={() => handleDeleteTransport(row?._id)}
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
