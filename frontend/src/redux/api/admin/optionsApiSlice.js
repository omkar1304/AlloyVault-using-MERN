import apiSlice from "../apiSlice";
import { ADMIN_URL } from "../../constant";
import encodeUrlPayload from "../../../helpers/encryptUrlPayload";
import encryptData from "../../../helpers/encryptData";

export const optionsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getOptions: builder.query({
      query: (data) => ({
        url: `${ADMIN_URL}/getOptions${encodeUrlPayload(data)}`,
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      providesTags: ["getOptions"],
    }),
    addOption: builder.mutation({
      query: (data) => ({
        url: `${ADMIN_URL}/addOption`,
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: { payload: encryptData(data) },
      }),
      invalidatesTags: ["getOptions", "getOptionsUserSide"],
    }),
    updateOptionField: builder.mutation({
      query: (data) => ({
        url: `${ADMIN_URL}/updateOptionField`,
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: { payload: encryptData(data) },
      }),
      invalidatesTags: ["getOptions", "getOptionsUserSide"],
    }),
    deleteOption: builder.mutation({
      query: (optionId) => ({
        url: `${ADMIN_URL}/deleteOption/${optionId}`,
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["getOptions", "getOptionsUserSide"],
    }),
  }),
});

export const {
  useGetOptionsQuery,
  useUpdateOptionFieldMutation,
  useAddOptionMutation,
  useDeleteOptionMutation,
} = optionsApiSlice;
