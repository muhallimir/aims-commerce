import { resetCartState } from "@store/cart.slice";
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

    const handleAuthentication = () => {
        if (isAuthenticated) {
            dispatch(clearUserInfo())
            dispatch(resetCartState())
            router.push("/store")
        } else {
            router.push("/signin")
        }
    };

    useEffect(() => {
        if (resSignIn.isSuccess || resRegister.isSuccess) {
            dispatch(updateUserInfo(resSignIn.data || resRegister.data));
            const targetRoute = isCheckingOut ? '/store/shipping' : '/store';
            router.push(targetRoute);
        }
    }, [resSignIn, resRegister]);

    return { reqSignIn, resSignIn, reqRegister, resRegister, isAuthenticated, isAdmin, handleAuthentication }
}

export default useAuthentication;