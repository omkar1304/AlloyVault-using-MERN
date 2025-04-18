import React, { useEffect, useState } from "react";
import { useGetUsersQuery } from "../../../redux/api/admin/userApiSlice";
import { PageHeader, PageSubHeader } from "../../../component/Headers";
import CustomSearch from "../../../component/CustomSearch";
import CustomTable from "../../../component/CustomTable";
import getTableColumns from "./getTableColumns";
import CustomButton from '../../../component/CustomButton';

const Users = () => {
  const [query, setQuery] = useState({
    page: 1,
    size: 25,
  });

  const {
    data: usersData,
    isLoading: isUsersLoading,
    isError: isErrorInUsers,
    refetch: getUsersRefetch,
  } = useGetUsersQuery({ ...query });

  useEffect(() => {
    getUsersRefetch();
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
          <PageHeader>Users</PageHeader>
          <PageSubHeader>
            Create and edit users for application to grow!
          </PageSubHeader>
        </div>
        <CustomButton size="large">Create User</CustomButton>
      </div>
      <CustomSearch
        query={query}
        setQuery={setQuery}
        placeholder="Search by user"
      />
      <CustomTable
        data={usersData?.users || []}
        total={usersData?.total}
        page={query?.page}
        size={query?.size}
        isLoading={isUsersLoading}
        columns={getTableColumns({})}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default Users;
