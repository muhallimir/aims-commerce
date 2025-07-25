import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { HYDRATE, createWrapper } from 'next-redux-wrapper';
import userReducer from "./user.slice";
import menuReducer from "./menu.slice";
import cartReducer from "./cart.slice";
import appReducer from "./app.slice";
import productReducer from "./products.slice";
import orderReducer from "./order.slice";
import summaryReducer from "./summary.slice";
import adminReducer from "./admin.slice";
import { apiSlice } from "./api.slice";
import { PERSIST, REGISTER, REHYDRATE, persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['app', 'user', 'productLists', 'cart', 'order', 'summary', 'admin'],
};

const rootReducer = (state, action) => {
  if (action.type === HYDRATE) {
    return {
      ...state,
      ...action.payload,
    };
  }
  return rootReducerWithoutHydrate(state, action);
};

const rootReducerWithoutHydrate = combineReducers({
  app: appReducer,
  user: userReducer,
  menuList: menuReducer,
  admin: adminReducer,
  productLists: productReducer,
  cart: cartReducer,
  order: orderReducer,
  summary: summaryReducer,
  [apiSlice.reducerPath]: apiSlice.reducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const makeStore = ({ isServer, ...props }) => {
  if (isServer) {
    return configureStore({
      reducer: persistedReducer,
      middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [REHYDRATE, PERSIST, REGISTER],
        },
      }).concat(
        apiSlice.middleware,
      ),
      devTools: process.env.NODE_ENV !== 'production',
      ...props,
    });
  } else {
    const store = configureStore({
      reducer: persistedReducer,
      middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [REHYDRATE, PERSIST, REGISTER],
        },
      }).concat(
        apiSlice.middleware,
      ),
      devTools: process.env.NODE_ENV !== 'production',
      ...props,
    });
    store.__persistor = persistStore(store);
    return store;
  }
};

export const wrapper = createWrapper(makeStore);