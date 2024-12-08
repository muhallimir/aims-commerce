import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    section: 'dashboard'
};

export const adminSlice = createSlice({
    name: "admin",
    initialState,
    reducers: {
        switchSection: (state, action) => {
            state.section = action.payload
        }
    },
    extraReducers: () => { },
});

export const { switchSection } = adminSlice.actions;

export default adminSlice.reducer;