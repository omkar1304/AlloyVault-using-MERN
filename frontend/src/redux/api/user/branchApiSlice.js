import apiSlice from "../apiSlice";
import { USER_URL } from "../../constant";
import encodeUrlPayload from "../../../helpers/encryptUrlPayload";

export const branchApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBranchAsOption: builder.query({
      query: (data) => ({
        url: `${USER_URL}/getBranchAsOption${encodeUrlPayload(data)}`,
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
  }),
});

export const { useGetBranchAsOptionQuery } = branchApiSlice;
