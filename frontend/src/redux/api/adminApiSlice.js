import apiSlice from "./apiSlice";
import { ADMIN_URL } from "../constant";
import encodeUrlPayload from "../../helpers/encryptUrlPayload";

export const adminApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRoles: builder.query({
      query: (data) => ({
        url: `${ADMIN_URL}/getRoles${encodeUrlPayload(data)}`,
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
      }),
    }),
  }),
});

export const { useGetRolesQuery } = adminApiSlice;
