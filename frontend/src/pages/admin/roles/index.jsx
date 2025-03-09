import React, { useEffect, useState } from "react";
import { useGetRolesQuery } from "../../../redux/api/adminApiSlice";
import { Grid, Input } from "antd";
import getTableColumns from "./getTableColumns";
import { PageHeader, PageSubHeader } from "../../../component/Headers";
import CustomTable from "./../../../component/CustomTable";
import AssignedUserModal from "./AssignedUserModal";
import CustomSearch from "../../../component/CustomSearch";
import CustomButton from "../../../component/CustomButton";
import AddRoleModal from "./AddRoleModal";

const { useBreakpoint } = Grid;
const { Search } = Input;
const Roles = () => {
  const screens = useBreakpoint();
  const [isAssignedUserModalOpen, setIsAssignedUserModalOpen] = useState(false);
  const [isAddRoleModalOpen, setIsAddRoleModalOpen] = useState(false);
  const [singleItem, setSingleItem] = useState(null);
  const [query, setQuery] = useState({
    page: 1,
    size: 25,
  });

  const {
    data: rolesData,
    isLoading: isRolesLoading,
    isError,
    refetch: getRolesRefetch,
  } = useGetRolesQuery({ ...query });

  useEffect(() => {
    getRolesRefetch();
  }, [query]);

  const onPageChange = (pageNumber, pageSize) => {
    setQuery({
      ...query,
      page: query?.size !== pageSize ? 1 : pageNumber,
      size: pageSize,
    });
    return;
  };

  const openAssignedUserModal = (item = null) => {
    setIsAssignedUserModalOpen(true);
    setSingleItem(item);
  };

  const closeAssignedUserModal = () => {
    setIsAssignedUserModalOpen(false);
    setSingleItem(null);
  };

  const openAddRoleModal = () => {
    setIsAddRoleModalOpen(true);
  };

  const closeAddRoleModal = () => {
    setIsAddRoleModalOpen(false);
  };

  return (
    <div>
      <AddRoleModal open={isAddRoleModalOpen} onClose={closeAddRoleModal} />
      <AssignedUserModal
        open={isAssignedUserModalOpen}
        onClose={closeAssignedUserModal}
        users={singleItem?.assignedUsers || []}
      />
      <div className="flex-row-space-between">
        <div>
          <PageHeader>Roles</PageHeader>
          <PageSubHeader>
            Create and edit roles to access application smoothly!
          </PageSubHeader>
        </div>
        <CustomButton onClick={openAddRoleModal}>Create Role</CustomButton>
      </div>
      <CustomSearch
        query={query}
        setQuery={setQuery}
        placeholder="Search by role"
      />
      <CustomTable
        data={rolesData?.roles || []}
        total={rolesData?.total}
        page={query?.page}
        size={query?.size}
        isLoading={isRolesLoading}
        columns={getTableColumns({ openAssignedUserModal })}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default Roles;
