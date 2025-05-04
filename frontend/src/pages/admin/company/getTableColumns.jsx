import { Avatar, Popconfirm, Tag, Tooltip } from "antd";
import { DeleteIcon, EditIcon } from "../../../component/ActionComponent";
import getFormattedDate from "../../../helpers/getFormattedDate";
import { useNavigate } from "react-router-dom";
import { FaExclamation } from "react-icons/fa6";
import getInitials from "../../../helpers/getInitials";

const getTableColumns = ({ handleDeleteCompany }) => {
  const navigate = useNavigate();
  return [
    {
      title: "Company Name",
      dataIndex: "name",
      width: 150,
      render: (x) => x,
    },
    {
      title: "Phone",
      dataIndex: "mobile",
      width: 100,
      render: (x) => x,
    },
    {
      title: "Email",
      dataIndex: "email",
      width: 100,
      render: (x) => x,
    },
    {
      title: "Assigned Branches",
      dataIndex: "branchesInfo",
      width: 150,
      render: (x) => (
        <div className="flex-row-start" style={{ flexWrap: "wrap"}}>
          {x?.map((branch) => (
            <Tag>{branch?.name || ""}</Tag>
          ))}
        </div>
      ),
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
                navigate(`/admin/company/edit?recordId=${row?._id}`)
              }
            />
          </Tooltip>
          <Popconfirm
            title="Delete the company"
            description="Are you sure to delete?"
            onConfirm={() => handleDeleteCompany(row?._id)}
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
