import { Avatar, Popconfirm, Tooltip } from "antd";
import { useNavigate } from "react-router-dom";
import getFormattedDate from "../../../../helpers/getFormattedDate";
import { DeleteIcon, EditIcon } from "../../../../component/ActionComponent";
import getInitials from "../../../../helpers/getInitials";

const getTableColumns = ({ handleDeleteStock }) => {
  const navigate = useNavigate();

  return [
    {
      title: "Date",
      dataIndex: "entryDate",
      width: 70,
      render: (x) => x && getFormattedDate(x),
    },
    {
      title: "Challan No.",
      dataIndex: "challanNo",
      width: 70,
      render: (x) => x,
    },
    {
      title: "Branch",
      dataIndex: "branch",
      width: 70,
      render: (x) => x,
    },
    {
      title: "BT Type",
      dataIndex: "btType",
      width: 70,
      render: (x) => x,
    },
    {
      title: "Material Type",
      dataIndex: "materialType",
      width: 70,
      render: (x) => x,
    },
    {
      title: "Item Detail",
      width: 120,
      render: (row) =>
        `${row?.grade || ""} ${row?.size || 0}mm ${row?.shape || ""}`,
    },
    {
      title: "Weight",
      dataIndex: "weight",
      width: 60,
      render: (x) => <span>{`${parseFloat(x).toFixed(2)} kg`}</span>,
    },
    {
      title: "Rack No.",
      dataIndex: "rackNo",
      width: 70,
      render: (x) => x,
    },
    {
      title: "Done By",
      dataIndex: "createdBy",
      width: 50,
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
            onClick={() => navigate(`/home/branchTransfer/edit?recordId=${row?._id}`)}
          />
          <Popconfirm
            title="Delete the record"
            description="Are you sure to delete?"
            onConfirm={() => handleDeleteStock(row?._id)}
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
