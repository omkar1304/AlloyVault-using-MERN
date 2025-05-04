import React, { useEffect } from "react";
import "../assets/css/customTable.css";
import { Grid, Pagination, Table } from "antd";
import CustomResult from "./CustomResult";

const { useBreakpoint } = Grid;

const CustomTable = ({
  data,
  total,
  page,
  size,
  isLoading,
  columns,
  onPageChange,
  isPaginationAllowed = true,
  scrollAllwoed= true,
}) => {
  const nextDisabled = page >= Math.ceil(total / size);
  const prevDisabled = page === 1;

  const screens = useBreakpoint();
  return (
    <>
      {!isLoading && !data.length && <CustomResult />}
      {(data.length || isLoading) && (
        <div className="custom-table-container">
          <Table
            scroll={scrollAllwoed && { x: 1500}}
            columns={columns}
            dataSource={data}
            loading={isLoading}
            pagination={false}
            rowClassName="custom-row"
            rowKey={(record) => record._id}
          />
          {isPaginationAllowed && (
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
                      onClick={() =>
                        !prevDisabled && onPageChange(page - 1, size)
                      }
                      className="pagination-btn"
                      disabled={prevDisabled}
                      style={{
                        cursor: `${prevDisabled ? "not-allowed" : "pointer"}`,
                      }}
                    >
                      ❮ Previous
                    </button>
                  );
                if (type === "next")
                  return (
                    <button
                      onClick={() =>
                        !nextDisabled && onPageChange(page + 1, size)
                      }
                      className="pagination-btn"
                      disabled={nextDisabled}
                      style={{
                        cursor: `${nextDisabled ? "not-allowed" : "pointer"}`,
                      }}
                    >
                      Next ❯
                    </button>
                  );
                return originalElement;
              }}
            />
          )}
        </div>
      )}
    </>
  );
};

export default CustomTable;
