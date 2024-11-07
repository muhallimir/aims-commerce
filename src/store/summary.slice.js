import { createSlice } from "@reduxjs/toolkit";
import { apiSlice } from "./api.slice";
import { setAppError, setLoading } from "./app.slice";

const initialState = {
    summary: {}
};

export const summarySlice = createSlice({
    name: "dashboard",
    initialState,
    reducers: {
        updateDashboard: (state, action) => {
            state.dashboard = action.payload;
        },
    },
    extraReducers: () => { },
});

export const { updateDashboard } = summarySlice.actions;

export default summarySlice.reducer;

/* ------------------------------ API ----------------------------- */

export const summaryApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        GetStoreSummary: builder.mutation({
            query: () => {
                return {
                    url: `/api/orders/summary`,
                    method: 'GET',
                };
            },
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                dispatch(setLoading(true));
                try {
                    const { data } = await queryFulfilled;
                    dispatch(updateDashboard(data));
                } catch ({ error }) {
                    dispatch(setAppError(error.status));
                } finally {
                    dispatch(setLoading(false));
                }
            },
        }),

    }),
});

export const { useGetStoreSummaryMutation } = summaryApiSlice;
