import apiSlice from "../apiSlice";
import encodeUrlPayload from "../../../helpers/encryptUrlPayload";
import encryptData from "../../../helpers/encryptData";
import { ADMIN_URL } from "../../constant";

export const companyApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCompanies: builder.query({
      query: (data) => ({
        url: `${ADMIN_URL}/getCompanies${encodeUrlPayload(data)}`,
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      providesTags: ["getCompanies"],
    }),
    addCompany: builder.mutation({
      query: (data) => ({
        url: `${ADMIN_URL}/addCompany`,
        method: "POST",
        credentials: "include",
        body: data,
      }),
      invalidatesTags: ["getCompanies"],
    }),
    getCompanyDetails: builder.query({
      query: (data) => ({
        url: `${ADMIN_URL}/getCompanyDetails${encodeUrlPayload(data)}`,
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    updateCompany: builder.mutation({
      query: ({ recordId, data }) => ({
        url: `${ADMIN_URL}/updateCompany/${recordId}`,
        method: "PUT",
        credentials: "include",
        body: data,
      }),
    }),
    deleteCompany: builder.mutation({
      query: (recordId) => ({
        url: `${ADMIN_URL}/deleteCompany/${recordId}`,
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["getCompanies"],
    }),
  }),
});

export const {
  useGetCompaniesQuery,
  useAddCompanyMutation,
  useGetCompanyDetailsQuery,
  useUpdateCompanyMutation,
  useDeleteCompanyMutation
} = companyApiSlice;
