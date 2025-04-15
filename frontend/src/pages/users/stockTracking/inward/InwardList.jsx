import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader, PageSubHeader } from "../../../../component/Headers";
import CustomButton from "../../../../component/CustomButton";
import { AddIcon } from "../../../../component/ActionComponent";
import CustomSearch from "../../../../component/CustomSearch";
import CustomTable from "../../../../component/CustomTable";
import getTableColumns from "./getTableColumns";

const InwardList = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState({
    page: 1,
    size: 25,
  });

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
            Record new stock received and update inventory seamlessly
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

      {/* <div className="filter-row flex-row-space-between">
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
      </div> */}

      <CustomTable
        // data={data?.partyRecords || []}
        data={[]}
        // total={data?.total}
        total={0}
        page={query?.page}
        size={query?.size}
        // isLoading={isLoading}
        columns={getTableColumns({  })}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default InwardList;
