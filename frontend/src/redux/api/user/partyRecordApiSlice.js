import apiSlice from "../apiSlice";
import { USER_URL } from "../../constant";
import encodeUrlPayload from "../../../helpers/encryptUrlPayload";
import encryptData from "../../../helpers/encryptData";

export const partyRecordApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPartyRecords: builder.query({
      query: (data) => ({
        url: `${USER_URL}/getPartyRecords${encodeUrlPayload(data)}`,
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      providesTags: ["getPartyRecords"],
    }),
    getPartyRecordsAsOption: builder.query({
      query: () => ({
        url: `${USER_URL}/getPartyRecordsAsOption`,
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    getPartyDetails: builder.query({
      query: (recordId) => ({
        url: `${USER_URL}/getPartyDetails/${recordId}`,
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    addPartyRecord: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/addPartyRecord`,
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: { payload: encryptData(data) },
      }),
    }),
    updatePartyRecord: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/updatePartyRecord/${data?.recordId}`,
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: { payload: encryptData(data) },
      }),
    }),
    deletePartyRecord: builder.mutation({
      query: (recordId) => ({
        url: `${USER_URL}/deletePartyRecord/${recordId}`,
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["getPartyRecords"],
    }),
  }),
});

export const {
  useGetPartyRecordsQuery,
  useGetPartyRecordsAsOptionQuery,
  useGetPartyDetailsQuery,
  useAddPartyRecordMutation,
  useUpdatePartyRecordMutation,
  useDeletePartyRecordMutation,
} = partyRecordApiSlice;
