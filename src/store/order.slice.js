import { createSlice } from "@reduxjs/toolkit";
import { apiSlice } from "./api.slice";
import { setAppError, setLoading } from "./app.slice";

/**
 * Normalise an order returned by the Next.js API.
 *
 * After the monorepo merge, /api/orders/* returns the camelCase shape from
 * `buildOrderResponse` in `src/lib/orderMap.ts`. The legacy MongoDB backend
 * returned objects with snake_case columns that the old `mapOrder` here
 * converted. We keep `mapOrder` as a defensive pass-through that:
 *   1. accepts BOTH the new camelCase API response and the old snake_case
 *      rows (so the slice still works if anything else feeds it raw data),
 *   2. normalises numeric fields to Number (postgres.js returns numerics
 *      as strings, and even the camelCase response can come back with a
 *      stringy number after JSON parse → re-stringify round-trips).
 */
const num = (v) => (v === null || v === undefined ? 0 : Number(v));

const mapOrder = (o) => {
  if (!o) return o;
  // New shape: { _id, user: { _id, ... }, orderItems: [...], ... }
  // Old shape: { id, user_id, items_price, ... }
  const isCamel = o._id !== undefined || o.itemsPrice !== undefined;
  if (isCamel) {
    return {
      ...o,
      _id: o._id,
      user: o.user || { _id: o.user_id, name: "", email: "" },
      orderItems: (o.orderItems || []).map((i) => ({
        ...i,
        product: i.product ?? i.product_id,
        seller: i.seller ?? i.seller_id,
        price: num(i.price),
      })),
      itemsPrice: num(o.itemsPrice ?? o.items_price),
      shippingPrice: num(o.shippingPrice ?? o.shipping_price),
      taxPrice: num(o.taxPrice ?? o.tax_price),
      totalPrice: num(o.totalPrice ?? o.total_price),
      paymentResult:
        typeof o.paymentResult === "string"
          ? (() => { try { return JSON.parse(o.paymentResult); } catch { return null; } })()
          : (o.paymentResult ?? null),
    };
  }
  // Old snake_case fallback
  return {
    _id: o.id,
    user: { _id: o.user_id, name: o.user?.name || o.user_name || "", email: o.user?.email || o.user_email || "" },
    orderItems: (o.orderItems || []).map((i) => ({
      product: i.product_id || i.product,
      name: i.name,
      qty: i.qty,
      price: num(i.price),
      image: i.image,
      seller: i.seller_id || i.seller,
    })),
    itemsPrice: num(o.items_price),
    shippingPrice: num(o.shipping_price),
    taxPrice: num(o.tax_price),
    totalPrice: num(o.total_price),
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
    paymentResult: o.payment_result ? (() => { try { return JSON.parse(o.payment_result); } catch { return null; } })() : null,
    createdAt: o.created_at,
    updatedAt: o.updated_at,
  };
};

const mapOrderForAdmin = (o) => {
  if (!o) return o;
  const isCamel = o._id !== undefined || o.itemsPrice !== undefined;
  if (isCamel) {
    return {
      ...o,
      _id: o._id,
      user: o.user || { _id: o.user_id, name: "", email: "" },
      orderItems: (o.orderItems || []).map((i) => ({
        ...i,
        product: i.product ?? i.product_id,
        seller: i.seller ?? i.seller_id,
        price: num(i.price),
        _id: i._id ?? i.id,
      })),
      itemsPrice: num(o.itemsPrice ?? o.items_price),
      shippingPrice: num(o.shippingPrice ?? o.shipping_price),
      taxPrice: num(o.taxPrice ?? o.tax_price),
      totalPrice: num(o.totalPrice ?? o.total_price),
      paymentResult:
        typeof o.paymentResult === "string"
          ? (() => { try { return JSON.parse(o.paymentResult); } catch { return null; } })()
          : (o.paymentResult ?? null),
    };
  }
  return {
    _id: o.id,
    user: { _id: o.user_id, name: o.user?.name || o.user_name || "", email: o.user?.email || o.user_email || "" },
    orderItems: (o.orderItems || []).map((i) => ({
      product: i.product_id || i.product,
      name: i.name,
      qty: i.qty,
      price: num(i.price),
      image: i.image,
      seller: i.seller_id || i.seller,
      _id: i.id,
    })),
    itemsPrice: num(o.items_price),
    shippingPrice: num(o.shipping_price),
    taxPrice: num(o.tax_price),
    totalPrice: num(o.total_price),
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
    paymentResult: o.payment_result ? (() => { try { return JSON.parse(o.payment_result); } catch { return null; } })() : null,
    createdAt: o.created_at,
  };
};

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
