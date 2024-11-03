import { resetCartState } from "@store/cart.slice";
import { clearOrderData } from "@store/order.slice";
import { clearUserInfo, updateUserInfo, usePostRegistrationMutation, usePostSignInMutation } from "@store/user.slice";
import isEmpty from "lodash/isEmpty";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useAuthentication = () => {
    const { userInfo } = useSelector(({ user }) => user)
    const { isCheckingOut } = useSelector(({ cart }) => cart)
    const [reqSignIn, resSignIn] = usePostSignInMutation();
    const [reqRegister, resRegister] = usePostRegistrationMutation();
    const dispatch = useDispatch()
    const isAuthenticated = !isEmpty(userInfo)
    const isAdmin = userInfo?.isAdmin
    const router = useRouter()

    const handleSignIn = () => {
        router.push("/signin")
    };

    const handleSignOut = () => {
        localStorage.removeItem('token');
        dispatch(clearUserInfo())
        dispatch(resetCartState())
        dispatch(clearOrderData())
        router.push("/store")
    };

    useEffect(() => {
        if (resSignIn.isSuccess || resRegister.isSuccess) {
            dispatch(updateUserInfo(resSignIn.data || resRegister.data));
            const token = resSignIn?.data?.token || resRegister?.data?.token;
            const targetRoute = isCheckingOut ? '/store/shipping' : '/store';
            if (token) {
                localStorage.setItem('token', token);
            }

            router.push(targetRoute);
        }
    }, [resSignIn, resRegister]);

    return { userInfo, reqSignIn, resSignIn, reqRegister, resRegister, isAuthenticated, isAdmin, handleSignIn, handleSignOut }
}

export default useAuthentication;