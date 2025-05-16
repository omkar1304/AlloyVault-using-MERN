import apiSlice from "../apiSlice";
import { USER_URL } from "../../constant";
import encodeUrlPayload from "../../../helpers/encryptUrlPayload";

export const challanRecordApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getChallanRecords: builder.query({
      query: (data) => ({
        url: `${USER_URL}/getChallanRecords${encodeUrlPayload(data)}`,
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      providesTags: ["getChallanRecords"],
    }),
    deleteChallanRecord: builder.mutation({
      query: (recordId) => ({
        url: `${USER_URL}/deleteChallanRecord/${recordId}`,
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["getChallanRecords"],
    }),
  }),
});

export const { useGetChallanRecordsQuery, useDeleteChallanRecordMutation } =
  challanRecordApiSlice;
