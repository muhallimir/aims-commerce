import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  theme: "light",
  loading: true,
  error: null,
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
  },
  extraReducers: () => { },
});

export const { switchTheme, setLoading, setAppError, resetAppError } = appSlice.actions;

export default appSlice.reducer;