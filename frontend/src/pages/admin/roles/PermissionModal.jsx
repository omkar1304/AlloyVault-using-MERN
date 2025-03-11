import { Descriptions, Modal, Collapse } from "antd";
import React from "react";
import ParentSwicthComponent from "./ParentSwicthComponent";
import ChildSwitchComponent from "./ChildSwitchComponent";

const { Panel } = Collapse;

const PermissionModal = ({ open, onClose, item }) => {
  return (
    <Modal
      title={"Permissions for " + item?.name}
      open={open}
      width={"60%"}
      onCancel={onClose}
      footer={null}
    >
      <Collapse
        style={{
          marginTop: 24,
          overflowX: "hidden",
          maxHeight: "70vh",
          overflowY: "auto",
        }}
        expandIconPosition={"start"}
      >
        {item?.perms?.map((mod, parentIndex) => {
          return (
            <Panel
              header={mod?.name}
              key={mod?.name}
              extra={
                <ParentSwicthComponent
                  moduleIndex={parentIndex}
                  roleId={item?._id}
                  value={mod?.access}
                />
              }
            >
              <Descriptions
                size="small"
                bordered
              >
                {mod?.children?.map((child, childIndex) => {
                  return (
                    <Descriptions.Item label={child?.name}>
                      <ChildSwitchComponent
                        parentIndex={parentIndex}
                        childIndex={childIndex}
                        roleId={item?._id}
                        value={child?.access}
                      />
                    </Descriptions.Item>
                  );
                })}
              </Descriptions>
            </Panel>
          );
        })}
      </Collapse>
    </Modal>
  );
};

export default PermissionModal;
