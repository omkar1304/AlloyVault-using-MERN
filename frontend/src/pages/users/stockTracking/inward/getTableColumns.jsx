import { Avatar, Popconfirm, Tooltip } from "antd";
import { useNavigate } from "react-router-dom";
import getFormattedDate from '../../../../helpers/getFormattedDate';
import { DeleteIcon, EditIcon } from "../../../../component/ActionComponent";
import getInitials from '../../../../helpers/getInitials';

const getTableColumns = ({handleDeleteRecord}) => {
  const navigate = useNavigate();

  return [
    {
      title: "Date",
      dataIndex: "entryDate",
      width: 180,
      render: (x) => x && getFormattedDate(x, true),
    },
    {
      title: "Invoice No.",
      dataIndex: "invoiceNo",
      width: 100,
      render: (x) => x,
    },
    {
      title: "Class",
      dataIndex: "materialClass",
      width: 100,
      render: (x) => x,
    },
    {
      title: "Grade",
      dataIndex: "grade",
      width: 100,
      render: (x) => x,
    },
    {
      title: "HSN no.",
      dataIndex: "HSNCode",
      width: 100,
      render: (x) => x,
    },
    {
      title: "Weight",
      dataIndex: "weight",
      width: 100,
      render: (x) => x,
    },
    {
      title: "Rack no.",
      dataIndex: "rackNo",
      width: 100,
      render: (x) => x,
    },
    {
      title: "Material Tyoe",
      dataIndex: "materialType",
      width: 100,
      render: (x) => x,
    },
    {
      title: "Branch",
      dataIndex: "branch",
      width: 100,
      render: (x) => x,
    },
    {
      title: "Company",
      dataIndex: "company",
      width: 100,
      render: (x) => x,
    },
    {
      title: "Transport",
      dataIndex: "transportName",
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
          <EditIcon
            onClick={() =>
              navigate(`/home/inward/edit?recordId=${row?._id}`)
            }
          />
          <Popconfirm
            title="Delete the role"
            description="Are you sure to delete?"
            // onConfirm={() => handleDeleteRecord(row?._id)}
            onCancel={null}
            okText="Yes"
            cancelText="No"
          >
            <DeleteIcon />
          </Popconfirm>
        </div>
      ),
    },
  ];
};

export default getTableColumns;
