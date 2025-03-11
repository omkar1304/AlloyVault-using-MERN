import React, { useEffect, useRef, useState } from "react";
import { useUpdatePermissionMutation } from "../../../redux/api/adminApiSlice";
import toast from "react-hot-toast";
import { Switch } from "antd";

const ParentSwicthComponent = ({ moduleIndex, roleId, value }) => {
  const [checked, setChecked] = useState(value);
  const oldValue = useRef(value);
  const [updatePermission, { isLoading: isPermissionUpdating }] =
    useUpdatePermissionMutation();

  const handleOnChange = async (newCheckedValue) => {
    try {
      await updatePermission({
        roleId,
        key: `perms.${moduleIndex}.access`,
        value: newCheckedValue,
      }).unwrap();
      setChecked(newCheckedValue);
      oldValue.current = newCheckedValue;
    } catch (error) {
      setChecked(oldValue.current);
      console.error(error);
      toast.error("Could not update permission");
    }
  };

  useEffect(() => {
    setChecked(value);
  }, [value]);

  return (
    <Switch
      checked={checked}
      unCheckedChildren={"Denied"}
      checkedChildren={"Granted"}
      loading={isPermissionUpdating}
      onChange={handleOnChange}
      onClick={(_, e) => {
        // If you don't want click extra trigger collapse, you can prevent this:
        e.stopPropagation();
      }}
    />
  );
};

export default ParentSwicthComponent;
