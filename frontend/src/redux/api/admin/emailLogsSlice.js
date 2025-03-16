import apiSlice from "../apiSlice";
import { ADMIN_URL } from "../../constant";
import encodeUrlPayload from "../../../helpers/encryptUrlPayload";

export const emailLogsSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getEmailLogs: builder.query({
      query: (data) => ({
        url: `${ADMIN_URL}/getEmailLogs${encodeUrlPayload(data)}`,
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
  }),
});

export const { useGetEmailLogsQuery } = emailLogsSlice;
