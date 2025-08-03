import { resetCartState } from "@store/cart.slice";
import { clearOrderData } from "@store/order.slice";
import { clearUserInfo, updateUserInfo, usePostRegistrationMutation, usePostSignInMutation, useUpdateProfileMutation } from "@store/user.slice";
import { setSellerInfo } from "@store/seller.slice";
import isEmpty from "lodash/isEmpty";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";

const useAuthentication = () => {
    const { userInfo, adminUsersData } = useSelector(({ user }) => user)
    const { isCheckingOut } = useSelector(({ cart }) => cart)
    const [reqSignIn, resSignIn] = usePostSignInMutation();
    const [reqRegister, resRegister] = usePostRegistrationMutation();
    const [reqUpdateProfile, resUpdateProfile] = useUpdateProfileMutation();
    const dispatch = useDispatch()
    const isAuthenticated = !isEmpty(userInfo)
    const isAdmin = userInfo?.isAdmin
    const isSeller = userInfo?.isSeller
    const router = useRouter()
    const isRegisteringNewUser = adminUsersData?.isRegisteringNewUser

    const handleSignIn = () => {
        window.location.href = "/signin";
    };

    const redirectToHome = () => {
        router.push("/store")
    }

    const handleSignOut = () => {
        Cookies.remove("token");
        dispatch(clearUserInfo())
        dispatch(resetCartState())
        dispatch(clearOrderData())
        redirectToHome()
    };

    useEffect(() => {
        if (resSignIn.isSuccess || resRegister.isSuccess || resUpdateProfile.isSuccess) {
            if (isRegisteringNewUser) {
                router.push("/admin/users")
            } else {
                const userData = resSignIn.data || resRegister.data || resUpdateProfile.data;
                dispatch(updateUserInfo(userData));

                // If user is a seller, populate sellerInfo state with user data
                if (userData?.isSeller) {
                    dispatch(setSellerInfo({
                        _id: userData._id,
                        name: userData.name,
                        email: userData.email,
                        storeName: userData.storeName,
                        storeDescription: userData.storeDescription,
                        phone: userData.phone,
                        address: userData.address,
                        city: userData.city,
                        country: userData.country,
                        isSeller: userData.isSeller,
                        createdAt: userData.createdAt,
                        updatedAt: userData.updatedAt
                    }));
                }

                const token = resSignIn?.data?.token || resRegister?.data?.token;
                const targetRoute = isCheckingOut ? "/store/shipping" : "/store";
                if (token) {
                    Cookies.set("token", token, { path: "/" });
                    router.replace(targetRoute);
                }
            }
        }
    }, [resSignIn, resRegister, resUpdateProfile]);

    return { userInfo, reqSignIn, resSignIn, reqRegister, reqUpdateProfile, resUpdateProfile, resRegister, isAuthenticated, isAdmin, isSeller, handleSignIn, handleSignOut, isRegisteringNewUser, redirectToHome }
}

export default useAuthentication;