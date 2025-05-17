import apiSlice from "../apiSlice";
import { USER_URL } from "../../constant";
import encodeUrlPayload from "../../../helpers/encryptUrlPayload";
import encryptData from "../../../helpers/encryptData";

export const branchApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTransports: builder.query({
      query: (data) => ({
        url: `${USER_URL}/getTransports${encodeUrlPayload(data)}`,
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      providesTags: ["getTransports"],
    }),
    getTransportAsOption: builder.query({
      query: () => ({
        url: `${USER_URL}/getTransportAsOption`,
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      providesTags: ["getTransportAsOption"],
    }),
    getTransportDetails: builder.query({
      query: (data) => ({
        url: `${USER_URL}/getTransportDetails${encodeUrlPayload(data)}`,
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    addTransport: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/addTransport`,
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: { payload: encryptData(data) },
      }),
      invalidatesTags: ["getBranches", "getBranchAsOption"],
    }),
    updateTransport: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/updateTransport/${data?.recordId}`,
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: { payload: encryptData(data) },
      }),
    }),
    deleteTransport: builder.mutation({
      query: (recordId) => ({
        url: `${USER_URL}/deleteTransport/${recordId}`,
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["getTransports"],
    }),
  }),
});

export const {
  useGetTransportsQuery,
  useGetTransportAsOptionQuery,
  useGetTransportDetailsQuery,
  useAddTransportMutation,
  useUpdateTransportMutation,
  useDeleteTransportMutation,
} = branchApiSlice;
