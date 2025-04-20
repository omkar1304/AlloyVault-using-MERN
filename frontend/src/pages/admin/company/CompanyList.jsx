import React, { useEffect, useState } from "react";
import { PageHeader, PageSubHeader } from "../../../component/Headers";
import CustomSearch from "../../../component/CustomSearch";
import CustomTable from "../../../component/CustomTable";
import getTableColumns from "./getTableColumns";
import CustomButton from "../../../component/CustomButton";
import {
  useDeleteCompanyMutation,
  useGetCompaniesQuery,
} from "../../../redux/api/admin/companyApiSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const CompanyList = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState({
    page: 1,
    size: 25,
  });

  const {
    data: companies,
    isLoading: isCompaniesLoading,
    isError: isErrorInCompanies,
    refetch: getComapniesRefetch,
  } = useGetCompaniesQuery({ ...query });
  const [deleteCompany, { isLoading: isCompanyDeleting }] =
    useDeleteCompanyMutation();

  useEffect(() => {
    getComapniesRefetch();
  }, [query]);

  const onPageChange = (pageNumber, pageSize) => {
    setQuery({
      ...query,
      page: query?.size !== pageSize ? 1 : pageNumber,
      size: pageSize,
    });
    return;
  };

  const handleDeleteCompany = async (recordId) => {
    try {
      await deleteCompany(recordId).unwrap();
      toast.success("Company deleted successfully!");
    } catch (error) {
      console.error(error);
      const errMessage = error?.data?.message || "Couldn't delete company!";
      toast.error(errMessage);
    }
  };

  const handleNavigate = () => {
    navigate("/admin/company/new");
  };

  return (
    <div>
      <div className="flex-row-space-between">
        <div>
          <PageHeader>Company</PageHeader>
          <PageSubHeader>Create and edit company details!</PageSubHeader>
        </div>
        <CustomButton size="large" onClick={handleNavigate}>
          Add Company
        </CustomButton>
      </div>
      <CustomSearch
        query={query}
        setQuery={setQuery}
        placeholder="Search by user"
      />
      <CustomTable
        data={companies?.companies || []}
        total={companies?.total}
        page={query?.page}
        size={query?.size}
        isLoading={isCompaniesLoading}
        columns={getTableColumns({ handleDeleteCompany })}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default CompanyList;
