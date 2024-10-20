import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_MONGODB_URI,
        // prepareHeaders: (headers) => {
        //     const token = localStorage?.getItem('accessToken');
        //     if (token) {
        //         headers.set('Authorization', `Bearer ${token}`);
        //     }
        //     return headers;
        // },
    }),
    endpoints: () => ({}),
});