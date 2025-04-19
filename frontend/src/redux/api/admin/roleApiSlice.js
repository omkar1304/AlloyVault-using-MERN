import apiSlice from "../apiSlice";
import encodeUrlPayload from "../../../helpers/encryptUrlPayload";
import encryptData from "../../../helpers/encryptData";
import { ADMIN_URL } from "../../constant";

export const roleApiSlice = apiSlice.injectEndpoints({
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
    getRolesAsOption: builder.query({
      query: () => ({
        url: `${ADMIN_URL}/getRolesAsOption`,
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }),
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
      invalidatesTags: ["getRoles"],
    }),
    updateRoleField: builder.mutation({
      query: (data) => ({
        url: `${ADMIN_URL}/updateRoleField`,
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: { payload: encryptData(data) },
      }),
      invalidatesTags: ["getRoles"],
    }),
    deleteRole: builder.mutation({
      query: (roleId) => ({
        url: `${ADMIN_URL}/deleteRole/${roleId}`,
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["getRoles"],
    }),
  }),
});

export const {
  useGetRolesQuery,
  useGetRolesAsOptionQuery,
  useAddRoleMutation,
  useUpdatePermissionMutation,
  useUpdateRoleFieldMutation,
  useDeleteRoleMutation,
} = roleApiSlice;
