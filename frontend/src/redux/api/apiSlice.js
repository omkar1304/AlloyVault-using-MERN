import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../constant";

const apiSlice = createApi({
  reducerPath: "api",
  tagTypes: [
    "getAuthenticatedUser",
    "getRoles",
    "getOptions",
    "getBrokersAsOption",
    "getPartyRecords",
    "getPartyRecordsAsOption",
    "getStockEntries",
    "getOptionsUserSide",
    "getUsers",
    "getUsersDetails",
    "getCompanies"
  ],
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
  endpoints: () => ({}),
});

export default apiSlice;
