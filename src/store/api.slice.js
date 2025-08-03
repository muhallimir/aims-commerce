import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from "js-cookie";

export const apiSlice = createApi({
    reducerPath: 'api',
    tagTypes: ['SellerProducts', 'SellerOrders', 'SellerAnalytics'],
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_MONGODB_URI,
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