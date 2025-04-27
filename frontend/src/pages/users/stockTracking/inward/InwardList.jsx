import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader, PageSubHeader } from "../../../../component/Headers";
import CustomButton from "../../../../component/CustomButton";
import { AddIcon } from "../../../../component/ActionComponent";
import CustomSearch from "../../../../component/CustomSearch";
import CustomTable from "../../../../component/CustomTable";
import getTableColumns from "./getTableColumns";
import {
  useDeleteStockEntryMutation,
  useGetStockEntriesQuery,
} from "../../../../redux/api/user/stockEntryApiSlice";
import { useGetAsOptionQuery } from "../../../../redux/api/user/optionsApiSlice";
import { DatePicker, Select } from "antd";
import filterOption from "../../../../helpers/filterOption";
import moment from "moment";
import toast from "react-hot-toast";

const { RangePicker } = DatePicker;

const InwardList = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState({
    page: 1,
    size: 25,
    type: "Inward"
  });
  const { data, isLoading, refetch } = useGetStockEntriesQuery({ ...query });
  const { data: branchOptions, isLoading: isBranchOptionsLoading } =
    useGetAsOptionQuery({ type: 1 });
  const { data: gradeOptions, isLoading: isGradeOptionsLoading } =
    useGetAsOptionQuery({ type: 4 });
  const { data: shapeOptions, isLoading: isShapeOptionsLoading } =
    useGetAsOptionQuery({ type: 6 });
  const {
      data: inwardTypeOptions,
      isLoading: isInwardTypeOptionsLoading,
    } = useGetAsOptionQuery({ type: 2 });
  const [deleteStockEntry, { isLoading: isStockEntryDeleting }] =
    useDeleteStockEntryMutation();

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

  const handleNavigateInwardForm = () => {
    navigate("/home/inward/new");
  };

  const handleDeleteStock = async (recordId) => {
    try {
      await deleteStockEntry(recordId).unwrap();
      toast.success("Stock deleted successfully!");
    } catch (error) {
      console.error(error);
      const errMessage = error?.data?.message || "Couldn't delete stock entry!";
      toast.error(errMessage);
    }
  };

  return (
    <div>
      <div className="flex-row-space-between">
        <div>
          <PageHeader>Inward Material</PageHeader>
          <PageSubHeader>
            Log new materials received into inventory. Track sources,
            quantities, and branch storage—fast and easy.
          </PageSubHeader>
        </div>
        <CustomButton
          size="large"
          icon={<AddIcon color="#FFF" />}
          onClick={handleNavigateInwardForm}
        >
          Add New
        </CustomButton>
      </div>
      <CustomSearch
        style={{ marginTop: "20px" }}
        query={query}
        setQuery={setQuery}
        placeholder="Search by inward records"
      />

      <div className="filter-row flex-row-space-between">
        <div className="filter-row-left">
          <Select
            style={{ width: 150 }}
            placeholder="Branch"
            loading={isBranchOptionsLoading}
            options={branchOptions}
            allowClear
            onChange={(selectedBranch) => {
              setQuery((old) => {
                let temp = JSON.parse(JSON.stringify(old));
                if (
                  (selectedBranch && !temp.selectedBranch) ||
                  (selectedBranch &&
                    temp.selectedBranch &&
                    selectedBranch !== temp.selectedBranch)
                ) {
                  temp["selectedBranch"] = selectedBranch;
                } else if (!selectedBranch && temp.selectedBranch) {
                  delete temp.selectedBranch;
                }
                return temp;
              });
            }}
            showSearch
            filterOption={filterOption}
          />
          <Select
            style={{ width: 150 }}
            placeholder="Grade"
            options={gradeOptions}
            loading={isGradeOptionsLoading}
            onChange={(selectedGrade) => {
              setQuery((old) => {
                let temp = JSON.parse(JSON.stringify(old));
                if (
                  (selectedGrade && !temp.selectedGrade) ||
                  (selectedGrade &&
                    temp.selectedGrade &&
                    selectedGrade !== temp.selectedGrade)
                ) {
                  temp["selectedGrade"] = selectedGrade;
                } else if (!selectedGrade && temp.selectedGrade) {
                  delete temp.selectedGrade;
                }
                return temp;
              });
            }}
            allowClear
            showSearch
            filterOption={filterOption}
          />
          <Select
            style={{ width: 150 }}
            placeholder="Shape"
            options={shapeOptions}
            loading={isShapeOptionsLoading}
            allowClear
            onChange={(selectedShape) => {
              setQuery((old) => {
                let temp = JSON.parse(JSON.stringify(old));
                if (
                  (selectedShape && !temp.selectedShape) ||
                  (selectedShape &&
                    temp.selectedShape &&
                    selectedShape !== temp.selectedShape)
                ) {
                  temp["selectedShape"] = selectedShape;
                } else if (!selectedShape && temp.selectedShape) {
                  delete temp.selectedShape;
                }
                return temp;
              });
            }}
            showSearch
            filterOption={filterOption}
          />
          <Select
            style={{ width: 150 }}
            placeholder="Inward Type"
            options={inwardTypeOptions}
            loading={isInwardTypeOptionsLoading}
            allowClear
            onChange={(selectedInwardType) => {
              setQuery((old) => {
                let temp = JSON.parse(JSON.stringify(old));
                if (
                  (selectedInwardType && !temp.selectedInwardType) ||
                  (selectedInwardType &&
                    temp.selectedInwardType &&
                    selectedInwardType !== temp.selectedInwardType)
                ) {
                  temp["selectedInwardType"] = selectedInwardType;
                } else if (!selectedInwardType && temp.selectedInwardType) {
                  delete temp.selectedInwardType;
                }
                return temp;
              });
            }}
            showSearch
            filterOption={filterOption}
          />
        </div>

        <RangePicker
          style={{ width: 250 }}
          format="DD MMM YY"
          onChange={(dates, dateStrings) => {
            if (dates) {
              const newDateRange = {
                start: moment(dateStrings[0], "DD MMM YY").toISOString(),
                end: moment(dateStrings[1], "DD MMM YY").toISOString(),
              };
              setQuery((old) => ({ ...old, dateRange: newDateRange }));
            } else {
              setQuery((old) => {
                const newQuery = { ...old };
                delete newQuery.dateRange;
                return newQuery;
              });
            }
          }}
        />
      </div>

      <CustomTable
        data={data?.stockEntryRecords || []}
        total={data?.total}
        page={query?.page}
        size={query?.size}
        isLoading={isLoading}
        columns={getTableColumns({ handleDeleteStock })}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default InwardList;
