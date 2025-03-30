import apiSlice from "../apiSlice";
import { USER_URL } from "../../constant";
import encodeUrlPayload from "../../../helpers/encryptUrlPayload";
import encryptData from "../../../helpers/encryptData";

export const brokerApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBrokersAsOption: builder.query({
      query: (data) => ({
        url: `${USER_URL}/getBrokersAsOption${encodeUrlPayload(data)}`,
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      providesTags: ["getBrokersAsOption"],
    }),
    addBroker: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/addBroker`,
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: { payload: encryptData(data) },
      }),
      invalidatesTags: ["getBrokersAsOption"],
    }),
    updateBroker: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/updateBroker/${data?.brokerId}`,
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: { payload: encryptData(data) },
      }),
      invalidatesTags: ["getBrokersAsOption"],
    }),
    deleteBroker: builder.mutation({
      query: (brokerId) => ({
        url: `${USER_URL}/deleteBroker/${brokerId}`,
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["getBrokersAsOption"],
    }),
  }),
});

export const {
  useGetBrokersAsOptionQuery,
  useAddBrokerMutation,
  useUpdateBrokerMutation,
  useDeleteBrokerMutation,
} = brokerApiSlice;
