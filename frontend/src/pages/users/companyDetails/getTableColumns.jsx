import { Avatar, Popconfirm, Tooltip } from "antd";
import { DeleteIcon, EditIcon } from "../../../component/ActionComponent";
import CustomButton from "./../../../component/CustomButton";
import getInitials from "../../../helpers/getInitials";
import { useNavigate } from "react-router-dom";

const getTableColumns = ({handleDeleteRecord}) => {
  const navigate = useNavigate();

  return [
    {
      title: "Company Name",
      dataIndex: "companyName",
      width: 150,
      render: (x) => x,
    },
    {
      title: "Party Type",
      dataIndex: "partyType",
      width: 100,
      render: (x) => x,
    },
    {
      title: "Broker",
      dataIndex: "broker",
      width: 100,
      render: (x) => x,
    },
    {
      title: "GSTIN",
      dataIndex: "gstNo",
      width: 100,
      render: (x) => x,
    },
    {
      title: "City",
      dataIndex: "city",
      width: 100,
      render: (x) => x,
    },
    {
      title: "State",
      dataIndex: "state",
      width: 100,
      render: (x) => x,
    },
    {
      title: "Country",
      dataIndex: "country",
      width: 100,
      render: (x) => x,
    },
    {
      title: "Pin code",
      dataIndex: "pincode",
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
              navigate(`/home/companyDetails/edit?recordId=${row?._id}`)
            }
          />
          <Popconfirm
            title="Delete the role"
            description="Are you sure to delete this role?"
            onConfirm={() => handleDeleteRecord(row?._id)}
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
