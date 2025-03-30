import React, { useEffect, useState } from "react";
import { PageHeader, PageSubHeader } from "../../../component/Headers";
import CustomButton from "../../../component/CustomButton";
import CustomSearch from "../../../component/CustomSearch";
import { useGetPartyRecordsQuery } from "../../../redux/api/user/partyRecordApiSlice";
import getTableColumns from "./getTableColumns";
import CustomTable from "../../../component/CustomTable";
import { AddIcon } from "../../../component/ActionComponent";
import { useNavigate } from "react-router-dom";

const CompanyList = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState({
    page: 1,
    size: 25,
  });
  const { data, isLoading, refetch } = useGetPartyRecordsQuery({ ...query });

  useEffect(() => {
    refetch();
  }, [query]);

  const onPageChange = (pageNumber, pageSize) => {
    setQuery({
      ...query,
      page: query?.size !== pageSize ? 1 : pageNumber,
      size: pageSize,
    });
    return;
  };

  const handleNavigateComapnyForm = () => {
    navigate("/home/companyDetails/new");
  };

  return (
    <div>
      <div className="flex-row-space-between">
        <div>
          <PageHeader>Company List</PageHeader>
          <PageSubHeader>
            Create and edit companies for better connect!
          </PageSubHeader>
        </div>
        <CustomButton
          icon={<AddIcon color="#FFF" />}
          onClick={handleNavigateComapnyForm}
        >
          Add New
        </CustomButton>
      </div>
      <CustomSearch
        style={{ marginTop: "20px" }}
        query={query}
        setQuery={setQuery}
        placeholder="Search by role"
      />
      <CustomTable
        data={data?.partyRecords || []}
        total={data?.total}
        page={query?.page}
        size={query?.size}
        isLoading={isLoading}
        columns={getTableColumns({})}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default CompanyList;
