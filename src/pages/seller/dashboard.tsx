import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { Box, Skeleton, Grid, Card, CardContent, Container } from "@mui/material";
import SellerDashboardLayout from "src/layouts/SellerDashboardLayout";

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
            router.push("/start-selling");
            return;
        }
    }, [userInfo, router, loading]);

    // Show loading while checking authentication
    if (loading || !userInfo) {
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
                    <Box
                        sx={{
                            width: 280,
                            bgcolor: "background.paper",
                            borderRight: "1px solid",
                            borderColor: "divider",
                            display: "flex",
                            flexDirection: "column"
                        }}
                    >
                        {/* Header section */}
                        <Box sx={{ p: 2, borderBottom: "1px solid", borderColor: "divider" }}>
                            <Skeleton variant="text" width={120} height={32} />
                        </Box>

                        {/* Menu items */}
                        <Box sx={{ pt: 2 }}>
                            {Array(4).fill(0).map((_, index) => (
                                <Box key={index} sx={{ px: 1, mb: 0.5 }}>
                                    <Box sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        px: 2,
                                        py: 1.5,
                                        borderRadius: 1
                                    }}>
                                        <Skeleton variant="circular" width={24} height={24} />
                                        <Skeleton variant="text" width={80} height={20} sx={{ ml: 2 }} />
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    </Box>

                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            flex: 1,
                        }}
                    >
                        <Box sx={{
                            height: { xs: 56, sm: 64 },
                            bgcolor: "primary.main",
                            display: "flex",
                            alignItems: "center",
                            px: 3,
                            boxShadow: 1
                        }}>
                            <Skeleton variant="circular" width={24} height={24} sx={{ bgcolor: "primary.light" }} />
                            <Skeleton variant="text" width={150} height={24} sx={{ mx: 2, bgcolor: "primary.light" }} />
                            <Box sx={{ flexGrow: 1 }} />
                            <Skeleton variant="text" width={100} height={20} sx={{ mr: 2, bgcolor: "primary.light" }} />
                            <Skeleton variant="circular" width={32} height={32} sx={{ bgcolor: "primary.light" }} />
                        </Box>

                        <Box
                            component="main"
                            sx={{
                                flexGrow: 1,
                                display: "flex",
                                flexDirection: "column",
                                p: 3,
                                bgcolor: "grey.50",
                            }}
                        >
                            <Skeleton variant="text" width={200} height={40} sx={{ mb: 3 }} />
                        </Box>
                    </Box>
                </Box>
            </Box>
        );
    }

    // Show loading if user is not a seller (while redirecting)
    if (!userInfo.isSeller) {
        return (
            <Box sx={{ display: "flex", minHeight: "100vh", width: "100%", bgcolor: "common.white" }}>
                <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Box textAlign="center">
                        <Skeleton variant="circular" width={60} height={60} sx={{ mx: "auto", mb: 2 }} />
                        <Skeleton variant="text" width={150} height={24} sx={{ mx: "auto" }} />
                    </Box>
                </Box>
            </Box>
        );
    }

    return <SellerDashboardLayout />;
};

export default SellerDashboard;
