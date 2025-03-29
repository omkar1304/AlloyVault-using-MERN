import { Switch } from "antd";
import React from "react";
import { useUpdateOptionFieldMutation } from "../../../../redux/api/admin/optionsSlice";
import toast from "react-hot-toast";

const EnabledSwitchComponent = ({ optionId, checkedValue }) => {
  const [checked, setChecked] = useState(checkedValue);
  const oldValue = useRef(checkedValue);
  const [updateOptionField, { isLoading }] = useUpdateOptionFieldMutation();

  const handleOnChange = async (newCheckedValue) => {
    try {
      await updateOptionField({
        optionId,
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
