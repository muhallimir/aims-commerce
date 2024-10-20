import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    menu: [],
};

export const menuSlice = createSlice({
    name: "menu",
    initialState,
    reducers: {
        updateMenu: (state, action) => ({
            ...state,
            menu: action?.payload,
        }),
    },
    extraReducers: () => { },
});

export const { updateMenu } = menuSlice.actions;

export default menuSlice.reducer;



