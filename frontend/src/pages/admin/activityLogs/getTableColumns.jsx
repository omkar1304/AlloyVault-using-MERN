import getFormattedDate from "../../../helpers/getFormattedDate";

const getTableColumns = ({}) => {
  return [
    {
      title: "Created Date",
      dataIndex: "createdAt",
      width: 150,
      render: (x) => x && getFormattedDate(x, true),
    },
    {
      title: "Name",
      dataIndex: "displayName",
      width: 150,
      render: (x) => x,
    },

    {
      title: "Action Performed",
      dataIndex: "action",
      width: 150,
      render: (x) => x,
    },
  ];
};

export default getTableColumns;
