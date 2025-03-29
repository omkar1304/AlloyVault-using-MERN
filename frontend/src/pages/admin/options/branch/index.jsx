import React, { useEffect, useState } from "react";
import { useGetOptionsQuery } from "../../../../redux/api/admin/optionsSlice";
import { PageHeader, PageSubHeader } from "../../../../component/Headers";
import CustomSearch from "../../../../component/CustomSearch";
import CustomTable from "../../../../component/CustomTable";
import getTableColumns from "./getTableColumns";

const Branch = () => {
  const [query, setQuery] = useState({
    page: 1,
    size: 25,
    type: 1,
  });

  const {
    data: branchOptions,
    isLoading: isOptionsLoading,
    isError: isErrorInOptions,
    refetch: getBranchOptionsRefetch,
  } = useGetOptionsQuery({ ...query });

  useEffect(() => {
    getBranchOptionsRefetch();
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
          <PageHeader>Branch Options</PageHeader>
          <PageSubHeader>Add and edit branch options here!</PageSubHeader>
        </div>
      </div>
      <CustomSearch
        query={query}
        setQuery={setQuery}
        placeholder="Search by name"
      />
      <CustomTable
        data={branchOptions?.logs || []}
        total={branchOptions?.total}
        page={query?.page}
        size={query?.size}
        isLoading={isOptionsLoading}
        columns={getTableColumns({})}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default Branch;
