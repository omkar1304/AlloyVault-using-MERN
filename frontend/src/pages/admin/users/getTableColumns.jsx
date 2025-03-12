
import {  EditIcon } from "../../../component/ActionComponent";
import getFormattedDate from '../../../helpers/getFormattedDate';

const getTableColumns = ({
}) => {
  return [
    {
      title: "Name",
      dataIndex: "displayName",
      width: 150,
      render: (x) => x,
    },
    {
      title: "Created Date",
      dataIndex: "createdAt",
      width: 150,
      render: (x) => x && getFormattedDate(x, true),
    },
    {
      title: "Email",
      dataIndex: "email",
      width: 150,
      render: (x) => x,
    },
    {
      title: "Role",
      dataIndex: "roleName",
      width: 150,
      render: (x) => x,
    },
    
    {
      title: "Actions",
      width: 50,
      render: (row) => (
        <div className="flex-row-start">
          <EditIcon />
        </div>
      ),
    },
  ];
};

export default getTableColumns;
