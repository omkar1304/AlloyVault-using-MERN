import apiSlice from "../apiSlice";
import encodeUrlPayload from "../../../helpers/encryptUrlPayload";
import encryptData from "../../../helpers/encryptData";
import { USER_URL } from "../../constant";

export const companyApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCompaniesAsOption: builder.query({
      query: (data) => ({
        url: `${USER_URL}/getCompaniesAsOption${encodeUrlPayload(data)}`,
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
  }),
});

export const {
  useGetCompaniesAsOptionQuery,
} = companyApiSlice;
