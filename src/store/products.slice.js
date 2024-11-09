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
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
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
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
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
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
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
    CreateNewProduct: builder.mutation({
      query: (args) => ({
        url: `/api/products`,
        method: 'POST',
        body: args,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
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
    UpdateProduct: builder.mutation({
      query: (args) => ({
        url: `/api/products/${args.productId}`,
        method: 'PUT',
        body: args,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
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
    DeleteProduct: builder.mutation({
      query: (args) => ({
        url: `/api/products/${args.productId}`,
        method: 'DELETE',
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
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
    UploadProductImage: builder.mutation({
      query: (file) => {
        const bodyFormData = new FormData();
        bodyFormData.append('image', file);
        return {
          url: '/api/uploads',
          method: 'POST',
          body: bodyFormData,
          responseHandler: 'text'
        };
      },
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
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

export const { useGetProductListMutation, useGetProductMutation, usePostProductReviewMutation, useDeleteProductMutation, useCreateNewProductMutation, useUpdateProductMutation, useUploadProductImageMutation } = productApiSlice;






