import React from "react";
import "../assets/css/customTable.css";
import { Grid, Pagination, Table } from "antd";

const { useBreakpoint } = Grid;

const CustomTable = ({
  data,
  total,
  page,
  size,
  isLoading,
  columns,
  onPageChange,
}) => {
  const nextDisabled = page >= Math.ceil(total / size);
  const prevDisabled = page === 1;

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
        rowKey="_id"
      />
      <Pagination
        current={page}
        pageSize={size}
        className="custom-pagination"
        total={total}
        showSizeChanger={false}
        onChange={(newPage, pageSize) => onPageChange(newPage, pageSize)}
        itemRender={(page, type, originalElement) => {
          if (type === "prev")
            return (
              <button
                onClick={() => !prevDisabled && onPageChange(page - 1, size)}
                className="pagination-btn"
                disabled={prevDisabled}
                style={{ cursor:  `${prevDisabled ? "not-allowed": "pointer"}` }}
              >
                ❮ Previous
              </button>
            );
          if (type === "next")
            return (
              <button
                onClick={() => !nextDisabled && onPageChange(page + 1, size)}
                className="pagination-btn"
                disabled={nextDisabled}
                style={{ cursor:  `${nextDisabled ? "not-allowed": "pointer"}` }}
              >
                Next ❯
              </button>
            );
          return originalElement;
        }}
      />
    </div>
  );
};

export default CustomTable;
