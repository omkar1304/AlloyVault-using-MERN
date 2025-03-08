import { DeleteIcon, EditIcon } from "../../../component/ActionComponent";
import CustomButton from "./../../../component/CustomButton";

const getTableColumns = ({ openAssignedUserModal }) => {
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
          <EditIcon />
          <DeleteIcon />
        </div>
      ),
    },
  ];
};

export default getTableColumns;
