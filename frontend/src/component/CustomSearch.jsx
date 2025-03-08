import React, { useState } from "react";
import { Input } from "antd";
import { SearchIcon } from "./ActionComponent";
import "../assets/css/customSearch.css";

const CustomSearch = ({ query, setQuery, placeholder = "" }) => {
  const [searchText, setSearchText] = useState("");

  const handleSearch = (value) => {
    setQuery((old) => {
      let temp = { ...old };

      if (!value.trim()) {
        delete temp.keyword;
      } else {
        temp.keyword = value.trim();
        temp.page = 1;
      }

      return temp;
    });
  };

  return (
    <Input
      placeholder={placeholder}
      suffix={
        <SearchIcon
          onClick={() => handleSearch(searchText)}
          size={16}
          className="custom-search-icon"
        />
      }
      className="custom-search"
      value={searchText}
      allowClear
      onChange={(e) => setSearchText(e.target.value)}
      onPressEnter={() => handleSearch(searchText)}
      onClear={() => handleSearch("")}
    />
  );
};

export default CustomSearch;
