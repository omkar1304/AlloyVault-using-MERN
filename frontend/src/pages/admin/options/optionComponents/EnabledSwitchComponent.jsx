import { Switch } from "antd";
import React, { useRef, useState } from "react";
import toast from "react-hot-toast";
import { useUpdateOptionFieldMutation } from "../../../../redux/api/admin/optionsApiSlice";

const EnabledSwitchComponent = ({ optionId, checkedValue }) => {
  const [checked, setChecked] = useState(checkedValue);
  const oldValue = useRef(checkedValue);
  const [updateOptionField, { isLoading }] = useUpdateOptionFieldMutation();

  const handleOnChange = async (newCheckedValue) => {
    try {
      await updateOptionField({
        recordId: optionId,
        fieldName: "isEnabled",
        fieldValue: newCheckedValue,
      }).unwrap();
      setChecked(newCheckedValue);
      oldValue.current = newCheckedValue;
      toast.success("Option updated successfully!");
    } catch (error) {
      console.error(error);
      setChecked(oldValue);
      const errMessage = error?.data?.message || "Couldn't update options!";
      toast.error(errMessage);
    }
  };

  return (
    <Switch
      checked={checked}
      size="small"
      loading={isLoading}
      onChange={handleOnChange}
      onClick={(checked, e) => {
        e.stopPropagation();
      }}
    />
  );
};

export default EnabledSwitchComponent;
