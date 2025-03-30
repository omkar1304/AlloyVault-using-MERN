import { Popconfirm } from "antd";
import { DeleteIcon, EditIcon } from "../../../../component/ActionComponent";
import EnabledSwitchComponent from "../optionComponents/EnabledSwitchComponent";
import getFormattedDate from "../../../../helpers/getFormattedDate";
import EditFieldComponent from "../../../../component/EditFieldComponent";

const getTableColumns = ({ updateOptionField, isOptionFieldUpdating, handleDeleteOption }) => {
  return [
    {
      title: "Name",
      width: 100,
      render: (row) => (
        <EditFieldComponent
          updateFunction={updateOptionField}
          updateFunctionLoader={isOptionFieldUpdating}
          recordId={row?._id}
          fieldName={"name"}
          fieldValue={row?.name}
        />
      ),
    },
    {
      title: "Enabled",
      width: 100,
      render: (x) => (
        <EnabledSwitchComponent optionId={x._id} checkedValue={x.isEnabled} />
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
          <Popconfirm
            title="Delete the role"
            description="Are you sure to delete this role?"
            onConfirm={() => handleDeleteOption(row?._id)}
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
