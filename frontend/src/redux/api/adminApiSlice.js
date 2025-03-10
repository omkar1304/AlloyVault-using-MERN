import apiSlice from "./apiSlice";
import { ADMIN_URL } from "../constant";
import encodeUrlPayload from "../../helpers/encryptUrlPayload";
import encryptData from "../../helpers/encryptData";

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
      providesTags: ["getRoles"],
    }),
    addRole: builder.mutation({
      query: (data) => ({
        url: `${ADMIN_URL}/addRole`,
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: { payload: encryptData(data) },
      }),
      invalidatesTags: ["getRoles"],
    }),
    updatePermission: builder.mutation({
      query: (data) => ({
        url: `${ADMIN_URL}/updatePermission`,
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

export const {
  useGetRolesQuery,
  useAddRoleMutation,
  useUpdatePermissionMutation,
} = adminApiSlice;
