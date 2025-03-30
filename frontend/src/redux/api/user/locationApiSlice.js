import apiSlice from "../apiSlice";
import encodeUrlPayload from "../../../helpers/encryptUrlPayload";
import { USER_URL } from "../../constant";

export const locationApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCountriesAsOption: builder.query({
      query: (data) => ({
        url: `${USER_URL}/getCountriesAsOption${encodeUrlPayload(data)}`,
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    getStatesAsOption: builder.query({
      query: (data) => ({
        url: `${USER_URL}/getStatesAsOption${encodeUrlPayload(data)}`,
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    getCitiesAsOption: builder.query({
      query: (data) => ({
        url: `${USER_URL}/getCitiesAsOption${encodeUrlPayload(data)}`,
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
  }),
});

export const {
  useGetCountriesAsOptionQuery,
  useGetStatesAsOptionQuery,
  useGetCitiesAsOptionQuery,
} = locationApiSlice;
