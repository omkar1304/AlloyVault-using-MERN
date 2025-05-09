import apiSlice from "../apiSlice";
import encodeUrlPayload from "../../../helpers/encryptUrlPayload";
import encryptData from "../../../helpers/encryptData";
import { ADMIN_URL } from "../../constant";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: (data) => ({
        url: `${ADMIN_URL}/getUsers${encodeUrlPayload(data)}`,
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      providesTags: ["getUsers"],
    }),
    getUserDetails: builder.query({
      query: (userId) => ({
        url: `${ADMIN_URL}/getUserDetails/${userId}`,
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      providesTags: ["getUsersDetails"],
    }),
    updateUser: builder.mutation({
      query: (data) => ({
        url: `${ADMIN_URL}/updateUser/${data?.recordId}`,
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: { payload: encryptData(data) },
      }),
      invalidatesTags: ["getUsersDetails", "getUsers"],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserDetailsQuery,
  useUpdateUserMutation,
} = userApiSlice;
