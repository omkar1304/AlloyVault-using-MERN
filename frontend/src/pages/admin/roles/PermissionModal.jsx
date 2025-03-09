import { Modal } from "antd";
import React from "react";

const renderPanel = (mod, parentIndex) => {
    return (
      <Panel
        header={mod?.name}
        key={parentIndex}
        extra={
          (!parentIndex.toString().includes("-") && (
            <MainSwitchComponent
              moduleIndex={parentIndex}
              roleId={roleId}
              value={mod?.access}
            />
          )) || (
            <Descriptions
              size="small"
              column={{ lg: 4, xl: 4, xxl: 4, md: 4, sm: 4, xs: 1 }}
              bordered
            >
              {[
                ["Read", "read"],
                ["Create", "create"],
                ["Update", "update"],
                ["Delete", "remove"],
              ].map((x) => (
                <Descriptions.Item label={x[0]} key={x[1]}>
                  <ChildSwitchComponent
                    parentIndex={parentIndex.split("-")[0]}
                    childIndex={parentIndex.split("-")[1]}
                    subChildIndex={parentIndex.split("-")[2]}
                    roleId={roleId}
                    operation={x[1]}
                    value={
                      perms[parentIndex.split("-")[0]]?.children[
                        parentIndex.split("-")[1]
                      ]?.children[parentIndex.split("-")[2]][x[1]]
                    }
                  />
                </Descriptions.Item>
              ))}
            </Descriptions>
          )
        }
      >
        {/* Handle cases where children is an array */}
        {Array.isArray(mod.children) && mod.children.length > 0 && (
          <Collapse>
            {mod.children.map((child, childIndex) => {
              if (child.name !== mod.name)
                return (
                  <Panel
                    header={child.name}
                    key={`${parentIndex}-${childIndex}`}
                    extra={
                      <Descriptions
                        size="small"
                        column={{ lg: 4, xl: 4, xxl: 4, md: 4, sm: 4, xs: 1 }}
                        bordered
                      >
                        {[
                          ["Read", "read"],
                          ["Create", "create"],
                          ["Update", "update"],
                          ["Delete", "remove"],
                        ].map((x) => (
                          <Descriptions.Item label={x[0]} key={x[1]}>
                            <ChildSwitchComponent
                              parentIndex={parentIndex}
                              childIndex={childIndex}
                              roleId={roleId}
                              operation={x[1]}
                              value={
                                perms[parentIndex]?.children[childIndex][x[1]]
                              }
                            />
                          </Descriptions.Item>
                        ))}
                      </Descriptions>
                    }
                  >
                    {/* Recursively render further children */}
                    {child.children && child.children.length > 0 && (
                      <Collapse>
                        {child.children.map((chld, chldIndex) =>
                          renderPanel(
                            chld,
                            `${parentIndex}-${childIndex}-${chldIndex}`
                          )
                        )}
                      </Collapse>
                    )}

                    {/* Render "Others" */}
                    <Row gutter={[16, 16]}>
                      <Col xl={24} lg={24} xxl={24} md={24} sm={24} xs={24}>
                        <Descriptions bordered title="Others">
                          {child.others &&
                            child.others.map((item, itemIndex) => (
                              <Descriptions.Item
                                label={item.name}
                                key={`other-${itemIndex}`}
                              >
                                <ItemSwitchComponent
                                  value={item.access}
                                  itemIndex={itemIndex}
                                  itemType={"others"}
                                  parentIndex={parentIndex}
                                  childIndex={childIndex}
                                  roleId={roleId}
                                />
                              </Descriptions.Item>
                            ))}
                        </Descriptions>
                      </Col>
                    </Row>

                    {/* Render "Page Items" */}
                    <Row gutter={[16, 16]}>
                      <Col xl={24} lg={24} xxl={24} md={24} sm={24} xs={24}>
                        <Descriptions bordered title="Page Items">
                          {child.pageItems &&
                            child.pageItems.map((item, itemIndex) => (
                              <Descriptions.Item
                                label={item.name}
                                key={`pageItems-${itemIndex}`}
                              >
                                <ItemSwitchComponent
                                  value={item.access}
                                  itemIndex={itemIndex}
                                  itemType={"pageItems"}
                                  parentIndex={parentIndex}
                                  childIndex={childIndex}
                                  roleId={roleId}
                                />
                              </Descriptions.Item>
                            ))}
                        </Descriptions>
                      </Col>
                    </Row>
                  </Panel>
                );
              else return null;
            })}
          </Collapse>
        )}

        {/* Handle cases where children is an object */}
        {!Array.isArray(mod.children) && mod.children?.others && (
          <Row gutter={[16, 16]}>
            <Col xl={12} lg={12} xxl={12} md={12} sm={24} xs={24}>
              <Descriptions bordered title="Others">
                {mod.children.others.map((item, itemIndex) => (
                  <Descriptions.Item
                    label={item.name}
                    key={`other-${itemIndex}`}
                  >
                    <ItemSwitchComponent
                      value={item.access}
                      itemIndex={itemIndex}
                      itemType={"others"}
                      parentIndex={parentIndex}
                      roleId={roleId}
                    />
                  </Descriptions.Item>
                ))}
              </Descriptions>

              <Descriptions bordered title="Page Items">
                {mod.children.others.map((item, itemIndex) => (
                  <Descriptions.Item
                    label={item.name}
                    key={`pageItems-${itemIndex}`}
                  >
                    <ItemSwitchComponent
                      value={item.access}
                      itemIndex={itemIndex}
                      itemType={"pageItems"}
                      parentIndex={parentIndex}
                      roleId={roleId}
                    />
                  </Descriptions.Item>
                ))}
              </Descriptions>
            </Col>
          </Row>
        )}
      </Panel>
    );
  };

const PermissionModal = ({ open, onClose, item }) => {
  return (
    <Modal
      title={"Permissions for " + item?.name}
      open={open}
      width={"60%"}
      onCancel={onClose}
      footer={null}
    >
      {/* <Collapse
        style={{
          marginTop: 24,
          overflowX: "hidden",
          maxHeight: "70vh",
          overflowY: "auto",
        }}
        className="custom-scroll"
        expandIconPosition={"start"}
      >
        {perms.map((mod, parentIndex) => renderPanel(mod, parentIndex))}
      </Collapse> */}
    </Modal>
  );
};

export default PermissionModal;
