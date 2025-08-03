import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import SellerHeader from "src/components/headers/SellerHeader";
import SellerSideDrawer from "src/components/drawers/SellerSideDrawer";
import SellerDashboardSection from "src/components/sections/seller/SellerDashboardSection";
import SellerProductsLayout from "./SellerProductsLayout";
import SellerOrdersLayout from "./SellerOrdersLayout";
import SellerProfileLayout from "./SellerProfileLayout";
import SellerOverviewLayout from "./SellerOverviewLayout";
import { useSelector } from "react-redux";

const SellerDashboardLayout: React.FC = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const { section } = useSelector(({ seller }: any) => seller);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const handleResize = () => {
                setSidebarOpen(window.innerWidth >= 900);
            };

            handleResize();

            window.addEventListener('resize', handleResize);

            return () => window.removeEventListener('resize', handleResize);
        }
    }, []);

    const renderSection = () => {
        switch (section) {
            case "overview":
                return <SellerOverviewLayout />;
            case "products":
                return <SellerProductsLayout />;
            case "orders":
                return <SellerOrdersLayout />;
            case "profile":
                return <SellerProfileLayout />;
            default:
                return <SellerOverviewLayout />;
        }
    };

    return (
        <Box
            sx={{
                display: "flex",
                minHeight: "100vh",
                width: "100%",
                bgcolor: "common.white",
                flexDirection: "column",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    flex: 1,
                }}
            >
                <SellerSideDrawer
                    isSidebarOpen={isSidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                />
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        flex: 1,
                    }}
                >
                    <SellerHeader />
                    <SellerDashboardSection>
                        {renderSection()}
                    </SellerDashboardSection>
                </Box>
            </Box>
        </Box>
    );
};

export default SellerDashboardLayout;
