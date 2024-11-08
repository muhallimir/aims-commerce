import { createSlice } from "@reduxjs/toolkit";
import { setAppError, setLoading } from "./app.slice";
import { apiSlice } from "./api.slice";

const initialState = {
  products: [],
  currentProduct: null,
  banner: []
};

export const productSlice = createSlice({
  name: "productList",
  initialState,
  reducers: {
    updateProductList: (state, action) => {
      state.products = action.payload;
    },
    setCurrentProduct: (state, action) => {
      state.currentProduct = action.payload;
    },
  },
  extraReducers: () => { },
});

export const { updateProductList, setCurrentProduct } = productSlice.actions;

export default productSlice.reducer;


/* ------------------------------ API ----------------------------- */

export const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    GetProductList: builder.mutation({
      query: () => ({
        url: '/api/products',
        method: 'GET',
      }),
      async onQueryStarted(_id, { dispatch, queryFulfilled }) {
        dispatch(setLoading(true));
        try {
          const { data } = await queryFulfilled;
          dispatch(updateProductList(data));
        } catch ({ error }) {
          dispatch(setAppError(error.status));
        } finally {
          dispatch(setLoading(false));
        }
      },
    }),
    GetProduct: builder.mutation({
      query: (args) => ({
        url: `/api/products/${args.productId}`,
        method: 'GET',
      }),
      async onQueryStarted(_id, { dispatch, queryFulfilled }) {
        dispatch(setLoading(true));
        try {
          const { data } = await queryFulfilled;
          dispatch(setCurrentProduct(data));
        } catch ({ error }) {
          dispatch(setAppError(error.status));
        } finally {
          dispatch(setLoading(false));
        }
      },
    }),
    PostProductReview: builder.mutation({
      query: (args) => ({
        url: `/api/products/${args.productId}/reviews`,
        method: 'POST',
        body: args
      }),
      async onQueryStarted(_id, { dispatch, queryFulfilled }) {
        dispatch(setLoading(true));
        try {
          await queryFulfilled;
        } catch ({ error }) {
          dispatch(setAppError(error.status));
        } finally {
          dispatch(setLoading(false));
        }
      },
    }),
  }),
});

export const { useGetProductListMutation, useGetProductMutation, usePostProductReviewMutation } = productApiSlice;






