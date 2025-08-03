import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import SellerDashboardLayout from "src/layouts/SellerDashboardLayout";
import LoadingOverlay from "src/components/loaders/TextLoader";

const SellerDashboard: React.FC = () => {
    const router = useRouter();
    const { userInfo } = useSelector((state: any) => state.user);
    const { loading } = useSelector((state: any) => state.app);

    useEffect(() => {
        // Check if user is authenticated
        if (!userInfo && !loading) {
            router.push("/signin");
            return;
        }

        // Check if user is a seller
        if (userInfo && !userInfo.isSeller) {
            router.push("/become-seller");
            return;
        }
    }, [userInfo, router, loading]);

    // Show loading while checking authentication
    if (loading || !userInfo) {
        return <LoadingOverlay loadingMessage="Loading seller dashboard..." />;
    }

    // Show loading if user is not a seller (while redirecting)
    if (!userInfo.isSeller) {
        return <LoadingOverlay loadingMessage="Redirecting..." />;
    }

    return <SellerDashboardLayout />;
};

export default SellerDashboard;
