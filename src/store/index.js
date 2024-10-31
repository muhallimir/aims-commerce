import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { HYDRATE, createWrapper } from 'next-redux-wrapper';
import userReducer from "./user.slice";
import menuReducer from "./menu.slice";
import cartReducer from "./cart.slice";
import appReducer from "./app.slice";
import productReducer from "./products.slice";
import { apiSlice } from "./api.slice";
import { PERSIST, REGISTER, REHYDRATE, persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['productLists', 'cartList'],
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
  productLists: productReducer,
  cartList: cartReducer,
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
      devTools: true,
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
      devTools: true,
      ...props,
    });
    store.__persistor = persistStore(store);
    return store;
  }
};

export const wrapper = createWrapper(makeStore);
