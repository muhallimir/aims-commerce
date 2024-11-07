import { createSlice } from "@reduxjs/toolkit";
import { apiSlice } from "./api.slice";
import { setAppError, setLoading } from "./app.slice";

const initialState = {
    orderData: {},
    orderList: [],
    fromPurchaseHistory: false,
};

export const orderSlice = createSlice({
    name: "order",
    initialState,
    reducers: {
        updateOrderData: (state, action) => {
            state.orderData = action.payload;
        },
        updateOrderList: (state, action) => {
            state.orderList = action.payload;
        },
        setFromPurchaseHistory: (state, action) => {
            state.fromPurchaseHistory = action.payload;
        },
        clearOrderData: () => {
            return initialState;
        },
    },
    extraReducers: () => { },
});

export const { updateOrderData, clearOrderData, updateOrderList, setFromPurchaseHistory } = orderSlice.actions;

export default orderSlice.reducer;

/* ------------------------------ API ----------------------------- */

export const orderApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        GetOrder: builder.mutation({
            query: (args) => {
                return {
                    url: `/api/orders/${args.orderId}`,
                    method: 'GET',
                };
            },
            async onQueryStarted(_id, { dispatch, queryFulfilled }) {
                dispatch(setLoading(true));
                try {
                    const { data } = await queryFulfilled;
                    dispatch(updateOrderData(data));
                } catch ({ error }) {
                    dispatch(setAppError(error.status));
                } finally {
                    dispatch(setLoading(false));
                }
            },
        }),
        GetOrdersHistory: builder.mutation({
            query: () => {
                return {
                    url: '/api/orders/purchase',
                    method: 'GET',
                };
            },
            async onQueryStarted(_id, { dispatch, queryFulfilled }) {
                dispatch(setLoading(true));
                try {
                    const { data } = await queryFulfilled;
                    dispatch(updateOrderList(data));
                } catch ({ error }) {
                    dispatch(setAppError(error.status));
                } finally {
                    dispatch(setLoading(false));
                }
            },
        }),
        PostPlaceOrder: builder.mutation({
            query: (args) => {
                return {
                    url: '/api/orders',
                    method: 'POST',
                    body: args,
                };
            },
        }),
        GetPayPalPaymentConfig: builder.mutation({
            query: () => ({
                url: '/api/config/paypal',
                method: "GET",
            }),
        }),
        CreateOrder: builder.mutation({
            query: (args) => {
                return {
                    url: `/api/orders/${args.orderId}/pay`,
                    method: 'PUT',
                    body: args,
                };
            },
        }),
    }),
});

export const { useGetOrderMutation, useGetOrdersHistoryMutation, usePostPlaceOrderMutation, useGetPayPalPaymentConfigMutation, useCreateOrderMutation } = orderApiSlice;
