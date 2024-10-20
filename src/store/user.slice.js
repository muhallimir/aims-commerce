import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userInfo: [],
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        updateUserInfo: (state, action) => ({
            ...state,
            userInfo: action?.payload,
        }),
    },
    extraReducers: () => { },
});

export const { updateUserInfo } = userSlice.actions;

export default userSlice.reducer;



