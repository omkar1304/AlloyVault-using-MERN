import apiSlice from "../apiSlice";
import { USER_URL } from "../../constant";
import encodeUrlPayload from "../../../helpers/encryptUrlPayload";
import encryptData from "../../../helpers/encryptData";

export const stockEntryApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStockEntries: builder.query({
      query: (data) => ({
        url: `${USER_URL}/getStockEntries${encodeUrlPayload(data)}`,
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      providesTags: ["getStockEntries"],
    }),
    getStockEntryDetails: builder.query({
      query: (data) => ({
        url: `${USER_URL}/getStockEntryDetails${encodeUrlPayload(data)}`,
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    addStockEntry: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/addStockEntry`,
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: { payload: encryptData(data) },
      }),
    }),
    updateStockEntry: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/updateStockEntry/${data?.recordId}`,
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: { payload: encryptData(data) },
      }),
    }),
    deleteStockEntry: builder.mutation({
      query: (recordId) => ({
        url: `${USER_URL}/deleteStockEntry/${recordId}`,
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["getStockEntries"],
    }),
  }),
});

export const {
  useGetStockEntriesQuery,
  useAddStockEntryMutation,
  useGetStockEntryDetailsQuery,
  useUpdateStockEntryMutation,
  useDeleteStockEntryMutation,
} = stockEntryApiSlice;
