import apiSlice from "../apiSlice";
import { ADMIN_URL } from "../../constant";
import encodeUrlPayload from "../../../helpers/encryptUrlPayload";
import encryptData from "../../../helpers/encryptData";

export const branchApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBranches: builder.query({
      query: (data) => ({
        url: `${ADMIN_URL}/getBranches${encodeUrlPayload(data)}`,
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      providesTags: ["getBranches"],
    }),
    getBranchAsOption: builder.query({
      query: () => ({
        url: `${ADMIN_URL}/getBranchAsOption`,
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      providesTags: ["getBranchAsOption"],
    }),
    getBranchDetails: builder.query({
      query: (data) => ({
        url: `${ADMIN_URL}/getBranchDetails${encodeUrlPayload(data)}`,
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    addBranch: builder.mutation({
      query: (data) => ({
        url: `${ADMIN_URL}/addBranch`,
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: { payload: encryptData(data) },
      }),
      invalidatesTags: ["getBranches", "getBranchAsOption"],
    }),
    updateBranch: builder.mutation({
      query: (data) => ({
        url: `${ADMIN_URL}/updateBranch/${data?.recordId}`,
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: { payload: encryptData(data) },
      }),
    }),
    deleteBranch: builder.mutation({
      query: (recordId) => ({
        url: `${ADMIN_URL}/deleteBranch/${recordId}`,
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["getBranches"],
    }),
  }),
});

export const {
  useGetBranchesQuery,
  useGetBranchAsOptionQuery,
  useGetBranchDetailsQuery,
  useAddBranchMutation,
  useUpdateBranchMutation,
  useDeleteBranchMutation,
} = branchApiSlice;
