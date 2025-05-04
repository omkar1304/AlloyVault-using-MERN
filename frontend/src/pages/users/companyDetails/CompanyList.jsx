import React, { useEffect, useState } from "react";
import { PageHeader, PageSubHeader } from "../../../component/Headers";
import CustomButton from "../../../component/CustomButton";
import CustomSearch from "../../../component/CustomSearch";
import {
  useDeletePartyRecordMutation,
  useGetPartyRecordsQuery,
} from "../../../redux/api/user/partyRecordApiSlice";
import getTableColumns from "./getTableColumns";
import CustomTable from "../../../component/CustomTable";
import { AddIcon } from "../../../component/ActionComponent";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Select } from "antd";
import filterOption from "../../../helpers/filterOption";
import { useGetBrokersAsOptionQuery } from "../../../redux/api/user/brokerApiSlice";
import {
  useGetCitiesAsOptionQuery,
  useGetCountriesAsOptionQuery,
  useGetStatesAsOptionQuery,
} from "../../../redux/api/user/locationApiSlice";

const CompanyList = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState({
    page: 1,
    size: 25,
    selectedCountry: "IN",
  });
  const { data, isLoading, refetch } = useGetPartyRecordsQuery({ ...query });
  const { data: borkerOptions, isLoading: isBrokerOptionsLoading } =
    useGetBrokersAsOptionQuery({});
  const { data: countryOptions, isLoading: isCountryOptionLoading } =
    useGetCountriesAsOptionQuery({});
  const { data: stateOption, isLoading: isStateOptionLoading } =
    useGetStatesAsOptionQuery(
      { countryCode: query?.selectedCountry },
      { skip: !query?.selectedCountry }
    );
  const { data: cityOption, isLoading: isCityOptionLoading } =
    useGetCitiesAsOptionQuery(
      { countryCode: query?.selectedCountry, stateCode: query?.selectedState },
      { skip: !query?.selectedCountry || !query?.selectedState }
    );
  const [deleteParty, { isLoading: isPartyDeleting }] =
    useDeletePartyRecordMutation();

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
      await deleteParty(recordId).unwrap();
      toast.success("Party deleted successfully!");
    } catch (error) {
      console.error(error);
      const errMessage = error?.data?.message || "Couldn't delete party!";
      toast.error(errMessage);
    }
  };

  const handleNavigateComapnyForm = () => {
    navigate("/home/partyDetails/new");
  };

  return (
    <div>
      <div className="flex-row-space-between">
        <div>
          <PageHeader>Party Details</PageHeader>
          <PageSubHeader>
            Create and edit parties for better connect!
          </PageSubHeader>
        </div>
        <CustomButton
          size="large"
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
        placeholder="Search by party"
      />

      <div className="filter-row flex-row-space-between">
        <div className="filter-row-left">
          <Select
            style={{ width: 120 }}
            placeholder="Broker"
            disabled={isBrokerOptionsLoading}
            options={borkerOptions}
            allowClear
            onChange={(selectedBroker) => {
              setQuery((old) => {
                let temp = JSON.parse(JSON.stringify(old));
                if (
                  (selectedBroker && !temp.selectedBroker) ||
                  (selectedBroker &&
                    temp.selectedBroker &&
                    selectedBroker !== temp.selectedBroker)
                ) {
                  temp["selectedBroker"] = selectedBroker;
                } else if (!selectedBroker && temp.selectedBroker) {
                  delete temp.selectedBroker;
                }
                return temp;
              });
            }}
            showSearch
            filterOption={filterOption}
          />
          <Select
            style={{ width: 120 }}
            placeholder="Country"
            options={countryOptions}
            disabled={isCountryOptionLoading}
            defaultValue={query?.selectedCountry}
            allowClear
            onChange={(selectedCountry) => {
              setQuery((old) => {
                let temp = JSON.parse(JSON.stringify(old));
                if (
                  (selectedCountry && !temp.selectedCountry) ||
                  (selectedCountry &&
                    temp.selectedCountry &&
                    selectedCountry !== temp.selectedCountry)
                ) {
                  temp["selectedCountry"] = selectedCountry;
                } else if (!selectedCountry && temp.selectedCountry) {
                  delete temp.selectedCountry;
                }
                return temp;
              });
            }}
            showSearch
            filterOption={filterOption}
          />
          <Select
            style={{ width: 120 }}
            placeholder="State"
            options={stateOption}
            disabled={isStateOptionLoading}
            allowClear
            onChange={(selectedState) => {
              setQuery((old) => {
                let temp = JSON.parse(JSON.stringify(old));
                if (
                  (selectedState && !temp.selectedState) ||
                  (selectedState &&
                    temp.selectedState &&
                    selectedState !== temp.selectedState)
                ) {
                  temp["selectedState"] = selectedState;
                } else if (!selectedState && temp.selectedState) {
                  delete temp.selectedState;
                }
                return temp;
              });
            }}
            showSearch
            filterOption={filterOption}
          />
          <Select
            style={{ width: 120 }}
            placeholder="City"
            options={cityOption}
            disabled={isCityOptionLoading}
            allowClear
            onChange={(selectedCity) => {
              setQuery((old) => {
                let temp = JSON.parse(JSON.stringify(old));
                if (
                  (selectedCity && !temp.selectedCity) ||
                  (selectedCity &&
                    temp.selectedCity &&
                    selectedCity !== temp.selectedCity)
                ) {
                  temp["selectedCity"] = selectedCity;
                } else if (!selectedCity && temp.selectedCity) {
                  delete temp.selectedCity;
                }
                return temp;
              });
            }}
            showSearch
            filterOption={filterOption}
          />
        </div>
      </div>

      <CustomTable
        data={data?.partyRecords || []}
        total={data?.total}
        page={query?.page}
        size={query?.size}
        isLoading={isLoading}
        columns={getTableColumns({ handleDeleteRecord })}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default CompanyList;
