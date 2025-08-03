import React from "react";
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Paper,
    Button,
    Chip,
    Alert,
} from "@mui/material";
import {
    TrendingUp,
    ShoppingCart,
    Inventory,
    AttachMoney,
    Add,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import {
    useGetSellerAnalyticsQuery,
    useGetSellerProductsQuery,
    useGetSellerOrdersQuery,
    switchSection,
} from "@store/seller.slice";
import CountUp from "react-countup";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import LoadingOverlay from "src/components/loaders/TextLoader";

const SellerOverviewLayout: React.FC = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const { analytics, products, orders } = useSelector(
        (state: any) => state.seller
    );
    const { userInfo } = useSelector((state: any) => state.user);
    const { loading } = useSelector((state: any) => state.app);

    const { error: analyticsError } = useGetSellerAnalyticsQuery({});
    const { error: productsError } = useGetSellerProductsQuery({});
    const { error: ordersError } = useGetSellerOrdersQuery({});

    const handleAddProduct = () => {
        router.push("/seller/products/new");
    };

    const handleViewProducts = () => {
        dispatch(switchSection("products"));
    };

    const handleViewOrders = () => {
        dispatch(switchSection("orders"));
    };

    // Fallback data with safe optional chaining
    const salesData = analytics?.monthlyRevenue?.length > 0 ? analytics.monthlyRevenue : [
        { name: "Jan", sales: 0 },
        { name: "Feb", sales: 0 },
        { name: "Mar", sales: 0 },
        { name: "Apr", sales: 0 },
        { name: "May", sales: 0 },
        { name: "Jun", sales: 0 },
    ];

    const recentOrders = orders?.slice(0, 5) || [];
    const lowStockProducts = products?.filter(
        (product: any) => product?.countInStock < 10
    ) || [];

    // Show loading state
    if (loading) {
        return <LoadingOverlay loadingMessage="Loading dashboard overview..." />;
    }

    // Show error state if any API failed
    const hasErrors = analyticsError || productsError || ordersError;
    if (hasErrors) {
        return (
            <Box>
                <Alert severity="error" sx={{ mb: 3 }}>
                    Failed to load dashboard data. Please try refreshing the page.
                </Alert>
                {/* Still show basic UI even with errors */}
                <Typography variant="h4" gutterBottom fontWeight="bold">
                    Welcome back, {userInfo?.name || 'Seller'}!
                </Typography>
            </Box>
        );
    }

    return (
        <Box>
            <Typography variant="h4" gutterBottom fontWeight="bold">
                Welcome back, {userInfo?.name}!
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
                Here's what's happening with your store today
            </Typography>

            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography color="text.secondary" gutterBottom>
                                        Total Revenue
                                    </Typography>
                                    <Typography variant="h4" component="div">
                                        $<CountUp end={analytics?.totalRevenue || 0} duration={2} />
                                    </Typography>
                                </Box>
                                <AttachMoney color="primary" sx={{ fontSize: 40 }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography color="text.secondary" gutterBottom>
                                        Total Orders
                                    </Typography>
                                    <Typography variant="h4" component="div">
                                        <CountUp end={analytics?.totalOrders || orders?.length || 0} duration={2} />
                                    </Typography>
                                </Box>
                                <ShoppingCart color="secondary" sx={{ fontSize: 40 }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography color="text.secondary" gutterBottom>
                                        Total Products
                                    </Typography>
                                    <Typography variant="h4" component="div">
                                        <CountUp end={analytics?.totalProducts || products?.length || 0} duration={2} />
                                    </Typography>
                                </Box>
                                <Inventory color="success" sx={{ fontSize: 40 }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography color="text.secondary" gutterBottom>
                                        Conversion Rate
                                    </Typography>
                                    <Typography variant="h4" component="div">
                                        <CountUp end={3.2} duration={2} decimals={1} />%
                                    </Typography>
                                </Box>
                                <TrendingUp color="warning" sx={{ fontSize: 40 }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Grid container spacing={3}>
                {/* Sales Chart */}
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Sales Overview
                        </Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={salesData}>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Line
                                    type="monotone"
                                    dataKey="sales"
                                    stroke="#1976d2"
                                    strokeWidth={2}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                {/* Quick Actions */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Quick Actions
                        </Typography>
                        <Box display="flex" flexDirection="column" gap={2}>
                            <Button
                                variant="contained"
                                startIcon={<Add />}
                                onClick={handleAddProduct}
                                fullWidth
                            >
                                Add New Product
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={handleViewProducts}
                                fullWidth
                            >
                                Manage Products
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={handleViewOrders}
                                fullWidth
                            >
                                View Orders
                            </Button>
                        </Box>
                    </Paper>

                    {/* Low Stock Alert */}
                    {lowStockProducts?.length > 0 && (
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom color="warning.main">
                                Low Stock Alert
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                {lowStockProducts?.length} products are running low
                            </Typography>
                            {lowStockProducts?.slice(0, 3).map((product: any) => (
                                <Box key={product?._id || Math.random()} sx={{ mb: 1 }}>
                                    <Typography variant="body2">{product?.name || 'Unknown Product'}</Typography>
                                    <Chip
                                        label={`${product?.countInStock || 0} left`}
                                        size="small"
                                        color="warning"
                                    />
                                </Box>
                            ))}
                        </Paper>
                    )}
                </Grid>

                {/* Recent Orders */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Recent Orders
                        </Typography>
                        {recentOrders?.length > 0 ? (
                            <Grid container spacing={2}>
                                {recentOrders?.map((order: any) => (
                                    <Grid item xs={12} sm={6} md={4} key={order?._id || Math.random()}>
                                        <Card variant="outlined">
                                            <CardContent>
                                                <Typography variant="h6" component="div">
                                                    Order #{order?._id?.slice(-8) || 'N/A'}
                                                </Typography>
                                                <Typography color="text.secondary">
                                                    ${order?.totalPrice?.toFixed(2) || '0.00'}
                                                </Typography>
                                                <Chip
                                                    label={order?.isPaid ? "Paid" : "Pending"}
                                                    color={order?.isPaid ? "success" : "warning"}
                                                    size="small"
                                                />
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        ) : (
                            <Typography color="text.secondary">
                                No recent orders. Start by adding products to your store!
                            </Typography>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default SellerOverviewLayout;
