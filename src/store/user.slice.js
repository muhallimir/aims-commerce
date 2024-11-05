import { createSlice } from "@reduxjs/toolkit";
import { apiSlice } from "./api.slice";

const initialState = {
    userInfo: {},
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        updateUserInfo: (state, action) => {
            state.userInfo = action.payload;
        },
        clearUserInfo(state) {
            state.userInfo = {};
        },
    },
    extraReducers: () => { },
});

export const { updateUserInfo, clearUserInfo } = userSlice.actions;

export default userSlice.reducer;


/* ------------------------------ API ----------------------------- */

export const userApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        PostSignIn: builder.mutation({
            query: (args) => ({
                url: '/api/users/signin',
                method: 'POST',
                body: args,
            }),
        }),
        PostRegistration: builder.mutation({
            query: (args) => ({
                url: '/api/users/register',
                method: 'POST',
                body: args,
            }),
        }),
        UpdateProfile: builder.mutation({
            query: (args) => {
                const token = localStorage.getItem("token")
                return {
                    url: '/api/users/profile',
                    method: 'PUT',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: args,
                }
            }
        }),
    }),
});

export const { usePostSignInMutation, usePostRegistrationMutation, useUpdateProfileMutation } = userApiSlice;









