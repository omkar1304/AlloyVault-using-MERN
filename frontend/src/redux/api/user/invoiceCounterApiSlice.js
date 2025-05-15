import apiSlice from "../apiSlice";
import { USER_URL } from "../../constant";
import encodeUrlPayload from "../../../helpers/encryptUrlPayload";

export const invoiceCounterApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getInvoiceNumber: builder.query({
      query: (data) => ({
        url: `${USER_URL}/getInvoiceNumber${encodeUrlPayload(data)}`,
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
  }),
});

export const { useGetInvoiceNumberQuery } = invoiceCounterApiSlice;
