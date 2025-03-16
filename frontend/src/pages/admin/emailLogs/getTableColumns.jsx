import getFormattedDate from "../../../helpers/getFormattedDate";
import { Tag } from "antd";
import { IoCloseCircleOutline } from "react-icons/io5";
import { MdOutlineCheckCircleOutline } from "react-icons/md";

const getTableColumns = ({}) => {
  return [
    {
      title: "Subject",
      dataIndex: "subject",
      width: 200,
      render: (x) => x,
    },
    {
      title: "Generated Date",
      dataIndex: "createdAt",
      width: 180,
      render: (x) => x && getFormattedDate(x, true),
    },
    {
      title: "Sender",
      dataIndex: "sender",
      width: 150,
      render: (x) => x,
    },
    {
      title: "TO",
      dataIndex: "recipientTO",
      width: 150,
      render: (x) => x,
    },
    {
      title: "CC",
      dataIndex: "recipientCC",
      width: 150,
      render: (x) => x,
    },
    {
      title: "Status",
      dataIndex: "status",
      width: 150,
      render: (x) => (
        <Tag
        className="flex-row-center"
          icon={x ? <MdOutlineCheckCircleOutline /> : <IoCloseCircleOutline />}
          color={x ? "success" : "error"}
        >
          {x ? "SUCCESS" : "FAILED"}
        </Tag>
      ),
    },
  ];
};

export default getTableColumns;
