import React, { useEffect, useState } from "react";
import { PageHeader, PageSubHeader } from "../../../component/Headers";
import CustomSearch from "../../../component/CustomSearch";
import CustomTable from "../../../component/CustomTable";
import getTableColumns from "./getTableColumns";
import { useGetActivityLogsQuery } from "../../../redux/api/admin/activityLogsApiSlice";

const ActivityLogs = () => {
  const [query, setQuery] = useState({
    page: 1,
    size: 25,
  });

  const {
    data: activityLogsData,
    isLoading: isLogsLoading,
    isError: isErrorInLogs,
    refetch: getActivityLogsRefetch,
  } = useGetActivityLogsQuery({ ...query });

  useEffect(() => {
    getActivityLogsRefetch();
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
          <PageHeader>Activity Logs</PageHeader>
          <PageSubHeader>
            Track and manage application activity logs!
          </PageSubHeader>
        </div>
      </div>
      <CustomSearch
        query={query}
        setQuery={setQuery}
        placeholder="Search by name/action"
      />
      <CustomTable
        data={activityLogsData?.logs || []}
        total={activityLogsData?.total}
        page={query?.page}
        size={query?.size}
        isLoading={isLogsLoading}
        columns={getTableColumns({})}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default ActivityLogs;
