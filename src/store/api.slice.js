import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from "js-cookie";

// Same-origin: /api/* hits Next.js API routes on Vercel serverless functions.
// If NEXT_PUBLIC_API_URI is explicitly set (e.g. for split deploy), use it.
const baseUrl =
  (typeof window !== "undefined" && process.env.NEXT_PUBLIC_API_URI) || "";

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