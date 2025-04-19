import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader, PageSubHeader } from "../../../../component/Headers";
import CustomButton from "../../../../component/CustomButton";
import { AddIcon } from "../../../../component/ActionComponent";
import CustomSearch from "../../../../component/CustomSearch";
import CustomTable from "../../../../component/CustomTable";
import getTableColumns from "./getTableColumns";
import { useGetStockEntriesQuery } from "../../../../redux/api/user/stockEntryApiSlice";
import { useGetAsOptionQuery } from "../../../../redux/api/user/optionsApiSlice";
import { DatePicker, Select } from "antd";
import filterOption from "../../../../helpers/filterOption";
import { shapeOptions } from "../../../../helpers/formOptions";
import moment from "moment";

const { RangePicker } = DatePicker;

const InwardList = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState({
    page: 1,
    size: 25,
    dateRange: {
      start: moment().add(-7, "days").toISOString(),
      end: moment().toISOString(),
    },
  });
  const { data, isLoading, refetch } = useGetStockEntriesQuery({ ...query });
  const { data: branchOptions, isLoading: isBranchOptionsLoading } =
    useGetAsOptionQuery({ type: 1, sameAsLabel: true });
  const { data: gradeOptions, isLoading: isGradeOptionsLoading } =
    useGetAsOptionQuery({ type: 4, sameAsLabel: true });
  const {
    data: materialTypeOptions,
    isLoading: isMaterialTypesOptionsLoading,
  } = useGetAsOptionQuery({ type: 2, sameAsLabel: true });

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
            disabled={isBranchOptionsLoading}
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
            disabled={isGradeOptionsLoading}
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
            placeholder="Purchase"
            options={materialTypeOptions}
            disabled={isMaterialTypesOptionsLoading}
            allowClear
            onChange={(selectedMaterialType) => {
              setQuery((old) => {
                let temp = JSON.parse(JSON.stringify(old));
                if (
                  (selectedMaterialType && !temp.selectedMaterialType) ||
                  (selectedMaterialType &&
                    temp.selectedMaterialType &&
                    selectedMaterialType !== temp.selectedMaterialType)
                ) {
                  temp["selectedMaterialType"] = selectedMaterialType;
                } else if (!selectedMaterialType && temp.selectedMaterialType) {
                  delete temp.selectedMaterialType;
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
        columns={getTableColumns({})}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default InwardList;
