import { Popconfirm, Tooltip } from "antd";
import { DeleteIcon } from "../../../../component/ActionComponent";

const getItemColumns = ({ handleRemoveItem }) => {
  return [
    {
      title: "Class",
      dataIndex: "materialClass",
      width: 100,
      render: (x) => x,
    },
    {
      title: "Grade",
      dataIndex: "grade",
      width: 150,
      render: (x) => x,
    },
    {
      title: "Size",
      dataIndex: "size",
      width: 100,
      render: (x) => x,
    },
    {
      title: "Shape",
      dataIndex: "shape",
      width: 100,
      render: (x) => x,
    },
    {
      title: "Weight",
      dataIndex: "weight",
      width: 100,
      render: (x) => x,
    },
    {
      title: "Rack No.",
      dataIndex: "rackNo",
      width: 100,
      render: (x) => x,
    },
    {
      title: "Description",
      dataIndex: "description",
      width: 150,
      render: (x) => x,
    },
    {
      title: "Actions",
      width: 100,
      render: (row) => (
        <div className="flex-row-start">
          <Popconfirm
            title="Delete the Item"
            description="Are you sure to delete?"
            onConfirm={() => handleRemoveItem(row?.uniqueKey)}
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

export default getItemColumns;
