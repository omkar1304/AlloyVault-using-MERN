import React, { useEffect, useState } from "react";
import { PageHeader, PageSubHeader } from "../../../component/Headers";
import CustomSearch from "../../../component/CustomSearch";
import CustomTable from "../../../component/CustomTable";
import getTableColumns from "./getTableColumns";
import { useGetEmailLogsQuery } from "../../../redux/api/admin/emailLogsApiSlice";

const EmailLogs = () => {
  const [query, setQuery] = useState({
    page: 1,
    size: 25,
  });

  const {
    data: emailLogsData,
    isLoading: isLogsLoading,
    isError: isErrorInLogs,
    refetch: getEmailLogsRefetch,
  } = useGetEmailLogsQuery({ ...query });

  useEffect(() => {
    getEmailLogsRefetch();
  }, [query]);

  const onPageChange = (pageNumber, pageSize) => {
    setQuery({
      ...query,
      page: query?.size !== pageSize ? 1 : pageNumber,
      size: pageSize,
    });
    return;
  };
  return (
    <div>
      <div className="flex-row-space-between">
        <div>
          <PageHeader>Email Logs</PageHeader>
          <PageSubHeader>
            Track and manage application email logs!
          </PageSubHeader>
        </div>
      </div>
      <CustomSearch
        query={query}
        setQuery={setQuery}
        placeholder="Search by subject"
      />
      <CustomTable
        data={emailLogsData?.logs || []}
        total={emailLogsData?.total}
        page={query?.page}
        size={query?.size}
        isLoading={isLogsLoading}
        columns={getTableColumns({})}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default EmailLogs;
