import React, { useEffect, useState } from "react";
import { PageHeader, PageSubHeader } from "../../../component/Headers";
import CustomSearch from "../../../component/CustomSearch";
import getTableColumns from "./getTableColumns";
import CustomTable from "../../../component/CustomTable";
import toast from "react-hot-toast";
import { DatePicker, Select, Switch } from "antd";
import filterOption from "../../../helpers/filterOption";
import {
  useDeleteChallanRecordMutation,
  useGetChallanRecordsQuery,
} from "../../../redux/api/user/challanRecordApiSlice";
import { useGetAsOptionQuery } from "../../../redux/api/user/optionsApiSlice";
import { useGetBranchAsOptionQuery } from "../../../redux/api/user/branchApiSlice";
import moment from "moment";

const { RangePicker } = DatePicker;

const ChallanList = () => {
  const [query, setQuery] = useState({
    page: 1,
    size: 25,
    type: "Outward",
  });
  const { data, isLoading, refetch } = useGetChallanRecordsQuery({ ...query });
  const { data: branchOptions, isLoading: isBranchOptionsLoading } =
    useGetBranchAsOptionQuery({});
  const { data: outwardTypeOptions, isLoading: isOutwardTypeOptionsLoading } =
    useGetAsOptionQuery({ type: 7 });
  const { data: btTypeOptions, isLoading: isBtTypeOptionsLoading } =
    useGetAsOptionQuery({ type: 8 });
  const [deleteChallan, { isLoading: isChallanDeleting }] =
    useDeleteChallanRecordMutation();

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

  const handleDeleteRecord = async (recordId) => {
    try {
      await deleteChallan(recordId).unwrap();
      toast.success("Challan deleted successfully!");
    } catch (error) {
      console.error(error);
      const errMessage = error?.data?.message || "Couldn't delete challan!";
      toast.error(errMessage);
    }
  };

  const handletTypeChange = (checked) => {
    setQuery((prev) => ({ ...prev, type: checked ? "BT" : "Outward" }));
  };

  return (
    <div>
      <div className="flex-row-space-between">
        <div>
          <PageHeader>Challan Records</PageHeader>
          <PageSubHeader>
            Access a list of all generated challans with full details.
          </PageSubHeader>
        </div>
      </div>
      <CustomSearch
        style={{ marginTop: "20px" }}
        query={query}
        setQuery={setQuery}
        placeholder="Search by party"
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
          {query?.type == "Outward" && (
            <Select
              style={{ width: 150 }}
              placeholder="Outward Type"
              options={outwardTypeOptions}
              loading={isOutwardTypeOptionsLoading}
              allowClear
              onChange={(selectedOutwardType) => {
                setQuery((old) => {
                  let temp = JSON.parse(JSON.stringify(old));
                  if (
                    (selectedOutwardType && !temp.selectedOutwardType) ||
                    (selectedOutwardType &&
                      temp.selectedOutwardType &&
                      selectedOutwardType !== temp.selectedOutwardType)
                  ) {
                    temp["selectedOutwardType"] = selectedOutwardType;
                  } else if (!selectedOutwardType && temp.selectedOutwardType) {
                    delete temp.selectedOutwardType;
                  }
                  return temp;
                });
              }}
              showSearch
              filterOption={filterOption}
            />
          )}

          {query?.type == "BT" && (
            <Select
              style={{ width: 150 }}
              placeholder="BT Type"
              options={btTypeOptions}
              loading={isBtTypeOptionsLoading}
              allowClear
              onChange={(selectedBtType) => {
                setQuery((old) => {
                  let temp = JSON.parse(JSON.stringify(old));
                  if (
                    (selectedBtType && !temp.selectedBtType) ||
                    (selectedBtType &&
                      temp.selectedBtType &&
                      selectedBtType !== temp.selectedBtType)
                  ) {
                    temp["selectedBtType"] = selectedBtType;
                  } else if (!selectedBtType && temp.selectedBtType) {
                    delete temp.selectedBtType;
                  }
                  return temp;
                });
              }}
              showSearch
              filterOption={filterOption}
            />
          )}
        </div>
        <div className="flex-row-start" style={{ gap: "1.2rem" }}>
          <div className="filter-row-left">
            <span style={{ color: "#1E293B" }}>Branch Transfer</span>
            <Switch
              defaultChecked={query?.type == "Outward" ? false : true}
              onChange={handletTypeChange}
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
      </div>

      <CustomTable
        data={data?.challanRecords || []}
        total={data?.total}
        page={query?.page}
        size={query?.size}
        isLoading={isLoading}
        columns={getTableColumns({ handleDeleteRecord, type: query?.type })}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default ChallanList;
