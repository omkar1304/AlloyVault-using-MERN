import { USER_URL } from "../../constant";
import apiSlice from "../apiSlice";
import encryptData from '../../../helpers/encryptData';


export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (payload) => ({
        url: `${USER_URL}/login`,
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: { payload: encryptData(payload) },
      }),
    }),
    getAuthenticatedUser: builder.query({
      query: () => ({
        url: `${USER_URL}/getAuthenticatedUser`,
        credentials: "include",
      }),
    }),
  }),
});

export const { useLoginMutation, useGetAuthenticatedUserQuery } = userApiSlice;
