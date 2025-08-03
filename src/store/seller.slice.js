import { createSlice } from "@reduxjs/toolkit";
import { apiSlice } from "./api.slice";
import { setAppError, setLoading } from "./app.slice";

const initialState = {
    section: 'overview',
    sellerInfo: null,
    products: [],
    orders: [],
    analytics: {
        totalRevenue: 0,
        totalOrders: 0,
        totalProducts: 0,
        monthlyRevenue: []
    }
};

export const sellerSlice = createSlice({
    name: "seller",
    initialState,
    reducers: {
        switchSection: (state, action) => {
            state.section = action.payload;
        },
        setSellerInfo: (state, action) => {
            state.sellerInfo = action.payload;
        },
        setSellerProducts: (state, action) => {
            state.products = action.payload;
        },
        setSellerOrders: (state, action) => {
            state.orders = action.payload;
        },
        setSellerAnalytics: (state, action) => {
            state.analytics = action.payload;
        },
    },
    extraReducers: () => { },
});

export const {
    switchSection,
    setSellerInfo,
    setSellerProducts,
    setSellerOrders,
    setSellerAnalytics
} = sellerSlice.actions;

export const sellerApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        becomeSeller: builder.mutation({
            query: (args) => ({
                url: "/api/sellers/become",
                method: "POST",
                body: args,
            }),
        }),
        getSeller: builder.query({
            query: (id) => `/api/sellers/${id}`,
        }),
        getSellerProducts: builder.query({
            query: () => "/api/sellers/products",
            providesTags: ['SellerProducts'],
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                dispatch(setLoading(true));
                try {
                    const { data } = await queryFulfilled;
                    dispatch(setSellerProducts(data));
                } catch ({ error }) {
                    dispatch(setAppError(error?.status));
                } finally {
                    dispatch(setLoading(false));
                }
            },
        }),
        getSellerOrders: builder.query({
            query: () => "/api/sellers/orders",
            providesTags: ['SellerOrders'],
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                dispatch(setLoading(true));
                try {
                    const { data } = await queryFulfilled;
                    dispatch(setSellerOrders(data));
                } catch ({ error }) {
                    dispatch(setAppError(error?.status));
                } finally {
                    dispatch(setLoading(false));
                }
            },
        }),
        getSellerAnalytics: builder.query({
            query: () => "/api/sellers/analytics",
            providesTags: ['SellerAnalytics'],
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                dispatch(setLoading(true));
                try {
                    const { data } = await queryFulfilled;
                    dispatch(setSellerAnalytics(data));
                } catch ({ error }) {
                    dispatch(setAppError(error?.status));
                } finally {
                    dispatch(setLoading(false));
                }
            },
        }),
        createSellerProduct: builder.mutation({
            query: (args) => ({
                url: "/api/sellers/products",
                method: "POST",
                body: args,
            }),
            invalidatesTags: ['SellerProducts', 'SellerAnalytics'],
        }),
        updateSellerProduct: builder.mutation({
            query: ({ productId, ...args }) => ({
                url: `/api/sellers/products/${productId}`,
                method: "PUT",
                body: args,
            }),
            invalidatesTags: ['SellerProducts', 'SellerAnalytics'],
        }),
        deleteSellerProduct: builder.mutation({
            query: ({ productId }) => ({
                url: `/api/sellers/products/${productId}`,
                method: "DELETE",
            }),
            invalidatesTags: ['SellerProducts', 'SellerAnalytics'],
        }),
        updateSellerProfile: builder.mutation({
            query: (profileData) => ({
                url: "/api/sellers/profile",
                method: "PUT",
                body: profileData,
            }),
            invalidatesTags: ['SellerAnalytics'],
        }),
        updateOrderStatus: builder.mutation({
            query: ({ orderId, ...args }) => ({
                url: `/api/sellers/orders/${orderId}/status`,
                method: "PUT",
                body: args,
            }),
            invalidatesTags: ['SellerOrders', 'SellerAnalytics'],
        }),
    }),
});

export const {
    useBecomeSellerMutation,
    useGetSellerQuery,
    useGetSellerProductsQuery,
    useGetSellerOrdersQuery,
    useGetSellerAnalyticsQuery,
    useCreateSellerProductMutation,
    useUpdateSellerProductMutation,
    useDeleteSellerProductMutation,
    useUpdateSellerProfileMutation,
    useUpdateOrderStatusMutation
} = sellerApiSlice;

export default sellerSlice.reducer;
