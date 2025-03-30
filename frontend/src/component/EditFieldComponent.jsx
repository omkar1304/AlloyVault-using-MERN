import React, { useState } from "react";
import { Divider, Input, Space, Tooltip, Button } from "antd";
import toast from "react-hot-toast";
import { EditFieldIcon } from "./ActionComponent";
import CustomButton from "./CustomButton";

const EditFieldComponent = ({
  updateFunction,
  updateFunctionLoader,
  fieldName,
  fieldValue,
  recordId,
}) => {
  const [value, setValue] = useState(fieldValue);
  const [editMode, setEditMode] = useState(false);

  const onValueChange = (e) => {
    setValue(e.target.value);
  };

  const enterEditMode = () => {
    setEditMode(true);
  };

  const exitEditMode = () => {
    setEditMode(false);
    setValue(value);
  };

  const handleUpdate = async () => {
    try {
      await updateFunction({ recordId, fieldName, fieldValue: value }).unwrap();
      toast.success("updated successfully!");
    } catch (error) {
      console.error(error);
      const errMessage = error?.data?.message || "Couldn't update!";
      toast.error(errMessage);
    }
    exitEditMode();
  };

  return (
    <>
      {editMode && (
        <Space>
          <Input
            disabled={updateFunctionLoader}
            value={value}
            onChange={onValueChange}
            style={{
              width: "100%",
            }}
          />
          <Divider orientation="vertical" />
          {!updateFunctionLoader && (
            <>
              <CustomButton type="secondary" onClick={exitEditMode}>
                Cancel
              </CustomButton>
              <Divider orientation="vertical" />
              <CustomButton type="primary" onClick={handleUpdate}>
                Save
              </CustomButton>
            </>
          )}
        </Space>
      )}
      {!editMode && (
        <div className="flex-row-start">
          <span>{value}</span>
          <Tooltip title="Edit">
            <EditFieldIcon size={16} onClick={enterEditMode} />
          </Tooltip>
        </div>
      )}
    </>
  );
};

export default EditFieldComponent;
