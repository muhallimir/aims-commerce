import React, { useEffect } from "react";
import { useRouter } from "next/router";

const SellerIndex = () => {
    const router = useRouter();

    useEffect(() => {
        router.replace("/seller/dashboard");
    }, [router]);

    return null;
};

export default SellerIndex;
