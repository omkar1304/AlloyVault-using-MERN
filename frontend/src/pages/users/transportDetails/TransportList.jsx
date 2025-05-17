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
import {
  useDeleteTransportMutation,
  useGetTransportsQuery,
} from "../../../redux/api/user/transportApiSlice";

const TransportList = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState({
    page: 1,
    size: 25,
  });

  const {
    data: transports,
    isLoading: isTransportLoading,
    isError: isErrorTransport,
    refetch: getTransportsRefetch,
  } = useGetTransportsQuery({ ...query });
  const [deleteTransport, { isLoading: isTransportDeleting }] =
    useDeleteTransportMutation();

  useEffect(() => {
    getTransportsRefetch();
  }, [query]);

  const onPageChange = (pageNumber, pageSize) => {
    setQuery({
      ...query,
      page: query?.size !== pageSize ? 1 : pageNumber,
      size: pageSize,
    });
    return;
  };

  const handleDeleteTransport = async (recordId) => {
    try {
      await deleteTransport(recordId).unwrap();
      toast.success("Transport details deleted successfully!");
    } catch (error) {
      console.error(error);
      const errMessage = error?.data?.message || "Couldn't delete transport details!";
      toast.error(errMessage);
    }
  };

  const handleNavigate = () => {
    navigate("/home/transportDetails/new");
  };

  return (
    <div>
      <div className="flex-row-space-between">
        <div>
          <PageHeader>Transport Details</PageHeader>
          <PageSubHeader>See all transport entries in one place.</PageSubHeader>
        </div>
        <CustomButton size="large" onClick={handleNavigate}>
          Add New
        </CustomButton>
      </div>
      <CustomSearch query={query} setQuery={setQuery} placeholder="Search" />
      <CustomTable
        data={transports?.transports || []}
        total={transports?.total}
        page={query?.page}
        size={query?.size}
        isLoading={isTransportLoading}
        columns={getTableColumns({ handleDeleteTransport })}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default TransportList;
