import { resetCartState } from "@store/cart.slice";
import { clearOrderData } from "@store/order.slice";
import { clearUserInfo, updateUserInfo, usePostRegistrationMutation, usePostSignInMutation, useUpdateProfileMutation } from "@store/user.slice";
import isEmpty from "lodash/isEmpty";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";

const useAuthentication = () => {
    const { userInfo, adminUsersData } = useSelector(({ user }: any) => user)
    const { isCheckingOut } = useSelector(({ cart }: any) => cart)
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
                dispatch(updateUserInfo(resSignIn.data || resRegister.data || resUpdateProfile.data));
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