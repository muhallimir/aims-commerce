import { configureStore } from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";
import userReducer from "./user.slice";
import menuReducer from "./menu.slice";
import appReducer from "./app.slice";
import productReducer from "./products.slice";
import { apiSlice } from "./api.slice";

export const makeStore = ({ ...props }) =>
  configureStore({
    reducer: {
      app: appReducer,
      user: userReducer,
      menuList: menuReducer,
      productLists: productReducer,
      [apiSlice.reducerPath]: apiSlice.reducer
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({}).concat(apiSlice.middleware),
    devTools: true,
    ...props,
  });

export const wrapper = createWrapper(makeStore);
