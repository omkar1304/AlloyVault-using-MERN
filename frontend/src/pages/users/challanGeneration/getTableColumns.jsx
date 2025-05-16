import { Avatar, Popconfirm, Tooltip } from "antd";
import { DeleteIcon, ViewIcon } from "../../../component/ActionComponent";
import getInitials from "../../../helpers/getInitials";
import { useNavigate } from "react-router-dom";
import getFormattedDate from "./../../../helpers/getFormattedDate";
import encryptString from "../../../helpers/encryptString";

const getTableColumns = ({ handleDeleteRecord }) => {
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
      width: 120,
      render: (x) => x,
    },
    {
      title: "Branch",
      dataIndex: "branch",
      width: 100,
      render: (x) => x,
    },
    {
      title: "Party Name",
      dataIndex: "partyName",
      width: 100,
      render: (x) => x,
    },
    {
      title: "Outward Type",
      dataIndex: "outwardType",
      width: 100,
      render: (x) => x,
    },
    {
      title: "Weight",
      dataIndex: "totalWeight",
      width: 100,
      render: (x) => <span>{`${parseFloat(x).toFixed(2)} kg`}</span>,
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
          <Tooltip title="View">
            <ViewIcon
              size={24}
              onClick={() =>
                navigate(
                  `/home/challanGeneration/preview?challan=${encryptString(
                    row?.challanNo
                  )}`
                )
              }
            />
          </Tooltip>
          <Popconfirm
            title="Delete the challan"
            description="Are you sure to delete?"
            onConfirm={() => handleDeleteRecord(row?._id)}
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
