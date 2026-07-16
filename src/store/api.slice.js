import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from "js-cookie";

// Same-origin: /api/* hits Next.js API routes on the same host
// (Vercel serverless in prod, next dev in local). No backend URL needed.
const baseUrl = "";

export const apiSlice = createApi({
    reducerPath: 'api',
    tagTypes: ['SellerProducts', 'SellerOrders', 'SellerAnalytics'],
    baseQuery: fetchBaseQuery({
        baseUrl,
        prepareHeaders: (headers) => {
            const token = Cookies.get("token");
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints: () => ({}),
});