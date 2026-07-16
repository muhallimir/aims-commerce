import { createSlice } from "@reduxjs/toolkit";
import { apiSlice } from "./api.slice";
import { setAppError, setLoading } from "./app.slice";

/**
 * Map PostgreSQL snake_case → MongoDB camelCase
 */
const mapOrder = (o) => ({
  _id: o.id,
  user: { _id: o.user_id, name: o.user?.name || o.user_name || "", email: o.user?.email || o.user_email || "" },
  orderItems: (o.orderItems || []).map((i) => ({
    product: i.product_id || i.product,
    name: i.name,
    qty: i.qty,
    price: Number(i.price),
    image: i.image,
    seller: i.seller_id || i.seller,
  })),
  itemsPrice: Number(o.items_price),
  shippingPrice: Number(o.shipping_price),
  taxPrice: Number(o.tax_price),
  totalPrice: Number(o.total_price),
  paymentMethod: o.payment_method,
  isPaid: o.is_paid,
  paidAt: o.paid_at,
  isDelivered: o.is_delivered,
  deliveredAt: o.delivered_at,
  shippingAddress: {
    fullName: o.shipping_full_name,
    contact: o.shipping_contact,
    address: o.shipping_address,
    city: o.shipping_city,
    postalCode: o.shipping_postal_code,
    country: o.shipping_country,
  },
  paymentResult: o.payment_result ? JSON.parse(o.payment_result) : null,
  createdAt: o.created_at,
  updatedAt: o.updated_at,
});

const mapOrderForAdmin = (o) => ({
  _id: o.id,
  user: { _id: o.user_id, name: o.user?.name || o.user_name || "", email: o.user?.email || o.user_email || "" },
  orderItems: (o.orderItems || []).map((i) => ({
    product: i.product_id || i.product,
    name: i.name,
    qty: i.qty,
    price: Number(i.price),
    image: i.image,
    seller: i.seller_id || i.seller,
    _id: i.id,
  })),
  itemsPrice: Number(o.items_price),
  shippingPrice: Number(o.shipping_price),
  taxPrice: Number(o.tax_price),
  totalPrice: Number(o.total_price),
  paymentMethod: o.payment_method,
  isPaid: o.is_paid,
  paidAt: o.paid_at,
  isDelivered: o.is_delivered,
  deliveredAt: o.delivered_at,
  shippingAddress: {
    fullName: o.shipping_full_name,
    contact: o.shipping_contact,
    address: o.shipping_address,
    city: o.shipping_city,
    postalCode: o.shipping_postal_code,
    country: o.shipping_country,
  },
  paymentResult: o.payment_result ? JSON.parse(o.payment_result) : null,
  createdAt: o.created_at,
});

const initialState = {
    orderData: {},
    orderList: [],
    fromPurchaseHistory: false,
    allOrders: {
        orders: []
    }
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
        setToManageOrders: (state, action) => {
            state.allOrders.orders = action.payload;
        },
    },
    extraReducers: () => { },
});

export const { updateOrderData, clearOrderData, updateOrderList, setFromPurchaseHistory, setToManageOrders } = orderSlice.actions;

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
                    dispatch(updateOrderData(mapOrder(data)));
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
                    dispatch(updateOrderList((data || []).map(mapOrder)));
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
        GetAllOrders: builder.mutation({
            query: () => {
                return {
                    url: `/api/orders`,
                    method: 'GET',
                };
            },
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                dispatch(setLoading(true));
                try {
                    const { data } = await queryFulfilled;
                    dispatch(setToManageOrders((data || []).map(mapOrderForAdmin)));
                } catch ({ error }) {
                    dispatch(setAppError(error.status));
                } finally {
                    dispatch(setLoading(false));
                }
            },
        }),
    }),
});

export const { useGetOrderMutation, useGetOrdersHistoryMutation, usePostPlaceOrderMutation, useGetPayPalPaymentConfigMutation, useCreateOrderMutation, useGetAllOrdersMutation } = orderApiSlice;
