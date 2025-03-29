import apiSlice from "../apiSlice";
import { ADMIN_URL } from "../../constant";
import encodeUrlPayload from "../../../helpers/encryptUrlPayload";
import encryptData from "../../../helpers/encryptData";

export const optionsSlice = apiSlice.injectEndpoints({
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
    }),
  }),
});

export const { useGetOptionsQuery, useUpdateOptionFieldMutation } = optionsSlice;
