import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  theme: "light",
  loading: true,
  error: null,
  routeBack: false,
  transitioning: false,
  isDemo: false
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    switchTheme: (state, action) => ({
      ...state,
      theme: action?.payload,
    }),
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setAppError: (state, { payload }) => ({ ...state, error: payload }),
    resetAppError: (state) => ({ ...state, error: null }),
    updateApp: (state, action) => ({ ...state, ...action.payload }),
    setIsDemo: (state, action) => ({
      ...state,
      isDemo: action.payload,
    }),
  },
  extraReducers: () => { },
});

export const { switchTheme, setLoading, setAppError, resetAppError, updateApp, setIsDemo } = appSlice.actions;

export default appSlice.reducer;