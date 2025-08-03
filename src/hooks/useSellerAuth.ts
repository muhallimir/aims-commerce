import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

const useSellerAuth = () => {
    const router = useRouter();
    const { userInfo } = useSelector((state: any) => state.user);

    useEffect(() => {
        // Check if user is authenticated
        if (!userInfo) {
            router.push("/signin");
            return;
        }

        // Check if user is a seller
        if (!userInfo.isSeller) {
            router.push("/start-selling");
            return;
        }
    }, [userInfo, router]);

    return {
        isAuthenticated: !!userInfo,
        isSeller: userInfo?.isSeller || false,
        userInfo,
    };
};

export default useSellerAuth;
