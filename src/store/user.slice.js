import { createSlice } from "@reduxjs/toolkit";
import { apiSlice } from "./api.slice";
import { setAppError, setLoading } from "./app.slice";

const initialState = {
    userInfo: {},
    adminUsersData: {
        allUsers: [],
        userInView: {},
        isRegisteringNewUser: false
    }
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        updateUserInfo: (state, action) => {
            state.userInfo = action.payload;
        },
        clearUserInfo() {
            return initialState;
        },
        setAllUsers: (state, action) => {
            state.adminUsersData.allUsers = action.payload;
        },
        setUserInview(state, action) {
            state.adminUsersData.userInView = action.payload;
        },
        setIsRegisteringNewUser(state, action) {
            state.adminUsersData.isRegisteringNewUser = action.payload;
        },
    },
    extraReducers: () => { },
});

export const { updateUserInfo, clearUserInfo, setAllUsers,
    setUserInview, setIsRegisteringNewUser } = userSlice.actions;

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
            query: (args) => ({
                url: '/api/users/profile',
                method: 'PUT',
                body: args,
            })
        }),
        GetUsers: builder.mutation({
            query: () => ({
                url: '/api/users',
                method: 'GET',
            }),
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                dispatch(setLoading(true));
                try {
                    const { data } = await queryFulfilled;
                    dispatch(setAllUsers(data));
                } catch ({ error }) {
                    dispatch(setAppError(error?.status));
                } finally {
                    dispatch(setLoading(false));
                }
            },
        }),
        GetUserToManage: builder.mutation({
            query: (args) => ({
                url: `/api/users/${args.userId}`,
                method: 'GET',
            }),
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                dispatch(setLoading(true));
                try {
                    const { data } = await queryFulfilled;
                    dispatch(setUserInview(data));
                } catch ({ error }) {
                    dispatch(setAppError(error?.status));
                } finally {
                    dispatch(setLoading(false));
                }
            },
        }),
        UpdateUser: builder.mutation({
            query: (args) => ({
                url: `/api/users/${args.userId}`,
                method: 'PUT',
                body: args.userInfo
            }),
        }),
    }),
});

export const { usePostSignInMutation, usePostRegistrationMutation, useUpdateProfileMutation, useGetUsersMutation, useGetUserToManageMutation, useUpdateUserMutation } = userApiSlice;









