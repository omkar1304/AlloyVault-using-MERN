import { Popconfirm, Tooltip } from "antd";
import { DeleteIcon, EditIcon } from "../../../../component/ActionComponent";
import getLabelFromValue from "../../../../helpers/getLabelFromValue";

const getItemColumns = ({
  recordId = null,
  handleRemoveItem,
  openItemModal,
  materialTypeOptions,
  gradeOptions,
  shapeOptions,
}) => {
  return [
    {
      title: "Material Type",
      dataIndex: "materialType",
      width: 100,
      render: (x) => getLabelFromValue(x, materialTypeOptions),
    },
    {
      title: "Grade",
      dataIndex: "grade",
      width: 150,
      render: (x) => getLabelFromValue(x, gradeOptions),
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
      render: (x) => getLabelFromValue(x, shapeOptions),
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
          <Tooltip title="Edit">
            <EditIcon onClick={() => openItemModal(row)} />
          </Tooltip>
          {!recordId && (
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
          )}
        </div>
      ),
    },
  ];
};

export default getItemColumns;
