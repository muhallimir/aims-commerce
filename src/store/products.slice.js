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
    GetProductListForChatbot: builder.query({
      query: () => ({
        url: '/api/products',
        method: 'GET',
      }),
    }),
    GetProductCategories: builder.query({
      query: () => ({
        url: '/api/products/categories',
        method: 'GET',
      }),
    }),
    SearchProducts: builder.query({
      query: (searchParams) => {
        const params = new URLSearchParams();
        if (searchParams.name) params.append('name', searchParams.name);
        if (searchParams.category) params.append('category', searchParams.category);
        if (searchParams.min) params.append('min', searchParams.min);
        if (searchParams.max) params.append('max', searchParams.max);
        if (searchParams.rating) params.append('rating', searchParams.rating);
        if (searchParams.order) params.append('order', searchParams.order);

        return {
          url: `/api/products?${params.toString()}`,
          method: 'GET',
        };
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

export const {
  useGetProductListMutation,
  useGetProductMutation,
  usePostProductReviewMutation,
  useDeleteProductMutation,
  useCreateNewProductMutation,
  useUpdateProductMutation,
  useUploadProductImageMutation,
  useGetProductListForChatbotQuery,
  useGetProductCategoriesQuery,
  useSearchProductsQuery
} = productApiSlice;






