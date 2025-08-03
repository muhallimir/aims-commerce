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
    extraReducers: (builder) => {
        // Listen for seller info updates and sync with userInfo if needed
        builder.addCase('seller/setSellerInfo', (state, action) => {
            // If the seller being updated is the current user, sync the userInfo
            if (state.userInfo._id === action.payload._id) {
                state.userInfo = {
                    ...state.userInfo,
                    name: action.payload.name || state.userInfo.name,
                    email: action.payload.email || state.userInfo.email,
                    storeName: action.payload.storeName || state.userInfo.storeName,
                    storeDescription: action.payload.storeDescription || state.userInfo.storeDescription,
                    phone: action.payload.phone || state.userInfo.phone,
                    address: action.payload.address || state.userInfo.address,
                    city: action.payload.city || state.userInfo.city,
                    country: action.payload.country || state.userInfo.country,
                };
            }
        });
    },
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
        GoogleSignIn: builder.mutation({
            query: (args) => ({
                url: "/api/users/google-auth",
                method: "POST",
                body: args,
            }),
        }),
    }),
});

export const { usePostSignInMutation, usePostRegistrationMutation, useUpdateProfileMutation, useGetUsersMutation, useGetUserToManageMutation, useUpdateUserMutation, useGoogleSignInMutation } = userApiSlice;