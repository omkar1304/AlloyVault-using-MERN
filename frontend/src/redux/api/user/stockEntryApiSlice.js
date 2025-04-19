import apiSlice from "../apiSlice";
import { USER_URL } from "../../constant";
import encodeUrlPayload from "../../../helpers/encryptUrlPayload";
import encryptData from "../../../helpers/encryptData";

export const partyRecordApiSlice = apiSlice.injectEndpoints({
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
  }),
});

export const { useGetStockEntriesQuery, useAddStockEntryMutation } =
  partyRecordApiSlice;
