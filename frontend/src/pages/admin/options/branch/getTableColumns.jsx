import { Popconfirm } from "antd";
import { DeleteIcon, EditIcon } from "../../../../component/ActionComponent";
import EnabledSwitchComponent from "../optionComponents/EnabledSwitchComponent";
import getFormattedDate from "../../../../helpers/getFormattedDate";

const getTableColumns = ({}) => {
  return [
    {
      title: "Name",
      dataIndex: "name",
      width: 100,
      render: (x) => x,
    },

    {
      title: "Enabled",
      width: 100,
      render: (x) => (
        <EnabledSwitchComponent principalId={x._id} value={x.isEnabled} />
      ),
    },
    {
      title: "Created By",
      dataIndex: "createdBy",
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
      title: "Actions",
      width: 50,
      render: (row) => (
        <div className="flex-row-start">
          <EditIcon
          // onClick={() => openPermissionModal(row)}
          />
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
