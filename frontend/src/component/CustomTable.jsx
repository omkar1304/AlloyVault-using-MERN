import React from "react";
import "../assets/css/customTable.css";
import { Grid, Pagination, Table } from "antd";

const { useBreakpoint } = Grid;

const CustomTable = ({ data, total, isLoading, columns }) => {
  const screens = useBreakpoint();
  return (
    <div className="custom-table-container">
      <Table
        scroll={screens.md && { x: 1000 }}
        // bordered
        columns={columns}
        dataSource={data}
        loading={isLoading}
        pagination={false}
        rowClassName="custom-row"
      />
      <Pagination
        className="custom-pagination"
        total={total}
        showSizeChanger={false}
        itemRender={(page, type, originalElement) => {
          if (type === "prev")
            return <button className="pagination-btn">❮ Previous</button>;
          if (type === "next")
            return <button className="pagination-btn">Next ❯</button>;
          return originalElement;
        }}
      />
    </div>
  );
};

export default CustomTable;
