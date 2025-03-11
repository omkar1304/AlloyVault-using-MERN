import { Divider, Tag, Modal } from "antd";
import React from "react";
import { Link } from "react-router-dom";

const AssignedUserModal = ({ open, onClose, users }) => {
  return (
    <Modal
      okButtonProps={{ style: { display: "none" } }}
      cancelButtonProps={{ style: { display: "none" } }}
      open={open}
      onCancel={onClose}
      title={"Assigned Users"}
    >
      <Divider />
      {users?.map((user) => {
        return (
          <Tag
            key={user?._id}
            style={{ marginBottom: "8px", padding: "2px 8px" }}
            color="#000"
          >
            <Link to={`/admin/users/${user._id}`}>{user.displayName}</Link>
          </Tag>
        );
      })}
    </Modal>
  );
};

export default AssignedUserModal;
