import { Popconfirm } from "antd";
import { DeleteIcon, EditIcon } from "../../../component/ActionComponent";
import CustomButton from "./../../../component/CustomButton";

const getTableColumns = ({
  openAssignedUserModal,
  openPermissionModal,
  handleDeleteRole,
}) => {
  return [
    {
      title: "Name",
      dataIndex: "name",
      width: 150,
      render: (x) => x,
    },
    {
      title: "Created By",
      dataIndex: "createdBy",
      width: 150,
      render: (x) => x,
    },
    {
      title: "Assigned To",
      width: 150,
      render: (row) => {
        return (
          <CustomButton
            type="secondary"
            onClick={() => openAssignedUserModal(row)}
            style={{}}
          >
            View Users
          </CustomButton>
        );
      },
    },
    {
      title: "Actions",
      width: 50,
      render: (row) => (
        <div className="flex-row-start">
          <EditIcon onClick={() => openPermissionModal(row)} />
          <Popconfirm
            title="Delete the role"
            description="Are you sure to delete this role?"
            onConfirm={() => handleDeleteRole(row?._id)}
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
