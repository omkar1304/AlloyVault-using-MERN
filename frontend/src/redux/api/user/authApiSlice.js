import { USER_URL } from "../../constant";
import apiSlice from "../apiSlice";
import encryptData from "../../../helpers/encryptData";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (payload) => ({
        url: `${USER_URL}/register`,
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: { payload: encryptData(payload) },
      }),
    }),
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
    logout: builder.mutation({
      query: () => ({
        url: `${USER_URL}/logout`,
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    sendOTP: builder.mutation({
      query: (payload) => ({
        url: `${USER_URL}/sendOTP`,
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: { payload: encryptData(payload) },
      }),
    }),
    verifyOTP: builder.mutation({
      query: (payload) => ({
        url: `${USER_URL}/verifyOTP`,
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: { payload: encryptData(payload) },
      }),
    }),
    resetPassword: builder.mutation({
      query: (payload) => ({
        url: `${USER_URL}/resetPassword`,
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

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useSendOTPMutation,
  useVerifyOTPMutation,
  useResetPasswordMutation,
  useGetAuthenticatedUserQuery,
} = authApiSlice;
