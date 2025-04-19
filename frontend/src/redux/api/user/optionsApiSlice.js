import apiSlice from "../apiSlice";
import { USER_URL } from "../../constant";
import encodeUrlPayload from "../../../helpers/encryptUrlPayload";

export const optionsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAsOption: builder.query({
      query: (data) => ({
        url: `${USER_URL}/getAsOption${encodeUrlPayload(data)}`,
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      providesTags: ["getOptionsUserSide"]
    }),
  }),
});

export const {
  useGetAsOptionQuery,
} = optionsApiSlice;
