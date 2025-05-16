import React, { useEffect, useState } from "react";
import { PageHeader, PageSubHeader } from "../../../component/Headers";
import CustomSearch from "../../../component/CustomSearch";
import CustomTable from "../../../component/CustomTable";
import getTableColumns from "./getTableColumns";
import CustomButton from "../../../component/CustomButton";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  useDeleteBranchMutation,
  useGetBranchesQuery,
} from "../../../redux/api/admin/branchApiSlice";

const BranchList = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState({
    page: 1,
    size: 25,
  });

  const {
    data: branches,
    isLoading: isBranchesLoading,
    isError: isErrorBranches,
    refetch: getBranchesRefetch,
  } = useGetBranchesQuery({ ...query });
  const [deleteBranch, { isLoading: isBranchDeleting }] =
    useDeleteBranchMutation();

  useEffect(() => {
    getBranchesRefetch();
  }, [query]);

  const onPageChange = (pageNumber, pageSize) => {
    setQuery({
      ...query,
      page: query?.size !== pageSize ? 1 : pageNumber,
      size: pageSize,
    });
    return;
  };

  const handleDeleteBranch = async (recordId) => {
    try {
      await deleteBranch(recordId).unwrap();
      toast.success("Branch deleted successfully!");
    } catch (error) {
      console.error(error);
      const errMessage = error?.data?.message || "Couldn't delete branch!";
      toast.error(errMessage);
    }
  };

  const handleNavigate = () => {
    navigate("/admin/branch/new");
  };

  return (
    <div>
      <div className="flex-row-space-between">
        <div>
          <PageHeader>Branch</PageHeader>
          <PageSubHeader>Create and edit branch details!</PageSubHeader>
        </div>
        <CustomButton size="large" onClick={handleNavigate}>
          Add Branch
        </CustomButton>
      </div>
      <CustomSearch
        query={query}
        setQuery={setQuery}
        placeholder="Search by user"
      />
      <CustomTable
        data={branches?.branches || []}
        total={branches?.total}
        page={query?.page}
        size={query?.size}
        isLoading={isBranchesLoading}
        columns={getTableColumns({ handleDeleteBranch })}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default BranchList;
