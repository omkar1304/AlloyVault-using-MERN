import { Popconfirm } from "antd";
import { DeleteIcon, EditIcon } from "../../../component/ActionComponent";
import CustomButton from "./../../../component/CustomButton";

const getTableColumns = ({}) => {
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
      render: (x) => x,
    },
    {
      title: "Actions",
      width: 50,
      render: (row) => (
        <div className="flex-row-start">
          <EditIcon />
          <Popconfirm
            title="Delete the role"
            description="Are you sure to delete this role?"
            // onConfirm={() => handleDeleteRole(row?._id)}
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
