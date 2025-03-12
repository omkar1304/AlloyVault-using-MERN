import React, { useEffect, useState } from "react";
import {
  useDeleteRoleMutation,
  useGetRolesQuery,
} from "../../../redux/api/adminApiSlice";
import getTableColumns from "./getTableColumns";
import { PageHeader, PageSubHeader } from "../../../component/Headers";
import CustomTable from "./../../../component/CustomTable";
import AssignedUserModal from "./AssignedUserModal";
import CustomSearch from "../../../component/CustomSearch";
import CustomButton from "../../../component/CustomButton";
import AddRoleModal from "./AddRoleModal";
import PermissionModal from "./PermissionModal";
import toast from "react-hot-toast";
import CustomResult from "../../../component/CustomResult";

const Roles = () => {
  const [isAssignedUserModalOpen, setIsAssignedUserModalOpen] = useState(false);
  const [isAddRoleModalOpen, setIsAddRoleModalOpen] = useState(false);
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
  const [singleItem, setSingleItem] = useState(null);
  const [query, setQuery] = useState({
    page: 1,
    size: 25,
  });

  const {
    data: rolesData,
    isLoading: isRolesLoading,
    isError: isErrorInRoles,
    refetch: getRolesRefetch,
  } = useGetRolesQuery({ ...query });

  const [deleteRole, { isLoading: isRoleDeleting }] = useDeleteRoleMutation();

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

  const handleDeleteRole = async (roleId) => {
    try {
      await deleteRole(roleId);
      toast.success("Role deleted successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Couldn't delete the role!");
    }
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

  const openPermissionModal = (item = null) => {
    setIsPermissionModalOpen(true);
    setSingleItem(item);
  };

  const closePermissionModal = () => {
    setIsPermissionModalOpen(false);
    setSingleItem(null);
  };

  if (isErrorInRoles) {
    return <CustomResult statusCode={500} />;
  }

  return (
    <div>
      <AddRoleModal open={isAddRoleModalOpen} onClose={closeAddRoleModal} />
      <AssignedUserModal
        open={isAssignedUserModalOpen}
        onClose={closeAssignedUserModal}
        users={singleItem?.assignedUsers || []}
      />
      <PermissionModal
        open={isPermissionModalOpen}
        onClose={closePermissionModal}
        item={singleItem}
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
        columns={getTableColumns({
          openAssignedUserModal,
          openPermissionModal,
          handleDeleteRole,
        })}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default Roles;
