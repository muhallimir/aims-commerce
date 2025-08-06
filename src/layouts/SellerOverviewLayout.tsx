import React, { useState, useEffect } from "react";
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
    Skeleton,
    IconButton,
    ButtonGroup,
    Stack,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Avatar,
    Divider,
} from "@mui/material";
import {
    TrendingUp,
    ShoppingCart,
    Inventory,
    AttachMoney,
    Add,
    Refresh,
    ShowChart,
    ChevronLeft,
    ChevronRight,
    Visibility,
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
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    Area,
    AreaChart,
} from "recharts";
import variables from "src/styles/theme/variables";

const SellerOverviewLayout: React.FC = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const { analytics, products, orders } = useSelector(
        (state: any) => state.seller
    );
    const { userInfo } = useSelector((state: any) => state.user);
    const { loading } = useSelector((state: any) => state.app);

    const { error: analyticsError, isFetching: analyticsFetching, refetch: refetchAnalytics } = useGetSellerAnalyticsQuery({});
    const { error: productsError, isFetching: productsFetching, refetch: refetchProducts } = useGetSellerProductsQuery({});
    const { error: ordersError, isFetching: ordersFetching, refetch: refetchOrders } = useGetSellerOrdersQuery({});

    const isRefreshing = analyticsFetching || productsFetching || ordersFetching;

    const [selectedPeriod, setSelectedPeriod] = useState<'1D' | '1W' | '1M' | '3M' | '6M' | '1Y' | 'ALL'>('1D');
    const [scrollPosition, setScrollPosition] = useState(0);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [openOrderDialog, setOpenOrderDialog] = useState(false);

    const generateRealSalesData = (period: string) => {
        const ordersData = orders || [];
        const dataPoints: any[] = [];

        const periodConfig = {
            '1D': {
                points: 24,
                unit: 'hour',
                format: (date: Date) => date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
            },
            '1W': {
                points: 14,
                unit: 'day',
                format: (date: Date) => date.toLocaleDateString('en-US', { weekday: 'short' })
            },
            '1M': {
                points: 60,
                unit: 'day',
                format: (date: Date) => date.getDate().toString()
            },
            '3M': {
                points: 24,
                unit: 'week',
                format: (date: Date) => `W${Math.ceil(date.getDate() / 7)}`
            },
            '6M': {
                points: 12,
                unit: 'month',
                format: (date: Date) => date.toLocaleDateString('en-US', { month: 'short' })
            },
            '1Y': {
                points: 24,
                unit: 'month',
                format: (date: Date) => date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
            },
            'ALL': {
                points: 36,
                unit: 'month',
                format: (date: Date) => date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
            }
        };

        const config = periodConfig[period as keyof typeof periodConfig];
        const now = new Date();

        for (let i = config.points - 1; i >= 0; i--) {
            let periodStart: Date;
            let periodEnd: Date;

            if (config.unit === 'hour') {
                periodStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() - i);
                periodEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() - i + 1);
            } else if (config.unit === 'day') {
                periodStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
                periodEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i + 1);
            } else if (config.unit === 'week') {
                const weekStart = now.getDate() - (i * 7);
                periodStart = new Date(now.getFullYear(), now.getMonth(), weekStart);
                periodEnd = new Date(now.getFullYear(), now.getMonth(), weekStart + 7);
            } else { // month
                periodStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
                periodEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
            }

            const periodSales = ordersData
                .filter((order: any) => {
                    if (!order?.createdAt) return false;
                    const orderDate = new Date(order.createdAt);
                    return orderDate >= periodStart && orderDate < periodEnd && order?.isPaid;
                })
                .reduce((sum: number, order: any) => sum + (order?.totalPrice || 0), 0);

            const orderCount = ordersData
                .filter((order: any) => {
                    if (!order?.createdAt) return false;
                    const orderDate = new Date(order.createdAt);
                    return orderDate >= periodStart && orderDate < periodEnd;
                }).length;

            dataPoints.push({
                name: config.format(periodStart),
                sales: Math.round(periodSales),
                volume: orderCount,
                date: periodStart.toISOString(),
                periodStart: periodStart.toISOString(),
                periodEnd: periodEnd.toISOString(),
            });
        }

        return dataPoints;
    };

    const handleRefreshAll = () => {
        refetchAnalytics();
        refetchProducts();
        refetchOrders();
    };

    const [salesData, setSalesData] = useState(() => generateRealSalesData(selectedPeriod));

    useEffect(() => {
        setSalesData(generateRealSalesData(selectedPeriod));
        setScrollPosition(0);
    }, [selectedPeriod, orders]);

    const getVisibleData = () => {
        const visibleCount = selectedPeriod === '1D' ? 24 :
            selectedPeriod === '1W' ? 7 :
                selectedPeriod === '1M' ? 30 :
                    selectedPeriod === '3M' ? 12 :
                        selectedPeriod === '6M' ? 6 :
                            selectedPeriod === '1Y' ? 12 : 18;

        const startIndex = Math.max(0, salesData.length - visibleCount - scrollPosition);
        const endIndex = Math.max(visibleCount, salesData.length - scrollPosition);

        return salesData.slice(startIndex, endIndex);
    };

    const calculatePeriodTotal = () => {
        const visibleData = getVisibleData();
        const totalRevenue = visibleData.reduce((sum, item) => sum + item.sales, 0);
        const totalOrders = visibleData.reduce((sum, item) => sum + item.volume, 0);

        const periodLabels = {
            '1D': 'Today',
            '1W': 'This Week',
            '1M': 'This Month',
            '3M': 'Last 3 Months',
            '6M': 'Last 6 Months',
            '1Y': 'This Year',
            'ALL': 'All Time'
        };

        return {
            total: totalRevenue,
            orders: totalOrders,
            period: periodLabels[selectedPeriod]
        };
    };

    const periodSummary = calculatePeriodTotal();

    const canScrollLeft = scrollPosition < salesData.length - (selectedPeriod === '1D' ? 24 :
        selectedPeriod === '1W' ? 7 :
            selectedPeriod === '1M' ? 30 :
                selectedPeriod === '3M' ? 12 :
                    selectedPeriod === '6M' ? 6 :
                        selectedPeriod === '1Y' ? 12 : 18);
    const canScrollRight = scrollPosition > 0;

    const handleScrollLeft = () => {
        if (canScrollLeft) {
            setScrollPosition(prev => prev + 1);
        }
    };

    const handleScrollRight = () => {
        if (canScrollRight) {
            setScrollPosition(prev => prev - 1);
        }
    };

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <Box
                    sx={{
                        background: 'rgba(255, 255, 255, 0.98)',
                        backdropFilter: 'blur(10px)',
                        border: `1px solid ${variables['--primary-aims-light']}`,
                        borderRadius: 2,
                        p: 2,
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                    }}
                >
                    <Typography variant="body2" sx={{ color: variables['--color-text-primary'], fontWeight: 600 }}>
                        {label}
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{
                            color: variables['--primary-aims-main'],
                            fontWeight: 700,
                            mt: 0.5
                        }}
                    >
                        ${payload[0].value.toLocaleString()}
                    </Typography>
                    <Typography variant="caption" sx={{ color: variables['--color-text-secondary'], display: 'block' }}>
                        Orders: {data.volume}
                    </Typography>
                </Box>
            );
        }
        return null;
    };

    const handleAddProduct = () => {
        router.push("/seller/products/new");
    };

    const handleViewProducts = () => {
        dispatch(switchSection("products"));
    };

    const handleViewOrders = () => {
        dispatch(switchSection("orders"));
    };

    const handleViewOrder = (order: any) => {
        setSelectedOrder(order);
        setOpenOrderDialog(true);
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const recentOrders = orders?.slice(0, 5) || [];
    const lowStockProducts = products?.filter(
        (product: any) => product?.countInStock < 10
    ) || [];

    if (loading || isRefreshing) {
        return (
            <Box>
                <Typography variant="h4" color="primary" component="div" gutterBottom>
                    <Skeleton width={300} height={40} />
                </Typography>
                <Typography variant="body1" component="div" gutterBottom>
                    <Skeleton width={400} height={24} />
                </Typography>

                <Grid container spacing={3} sx={{ mb: 4 }}>
                    {Array(4).fill(0).map((_, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <Card>
                                <CardContent>
                                    <Box display="flex" alignItems="center" justifyContent="space-between">
                                        <Box>
                                            <Skeleton variant="text" width={100} height={20} sx={{ mb: 1 }} />
                                            <Skeleton variant="text" width={80} height={40} />
                                        </Box>
                                        <Skeleton variant="circular" width={40} height={40} />
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                        <Paper sx={{ p: 3 }}>
                            <Skeleton variant="text" width={150} height={32} sx={{ mb: 2 }} />
                            <Skeleton variant="rectangular" width="100%" height={300} sx={{ borderRadius: 1 }} />
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Paper sx={{ p: 3, mb: 3 }}>
                            <Skeleton variant="text" width={120} height={32} sx={{ mb: 2 }} />
                            <Box display="flex" flexDirection="column" gap={2}>
                                <Skeleton variant="rectangular" width="100%" height={36} sx={{ borderRadius: 1 }} />
                                <Skeleton variant="rectangular" width="100%" height={36} sx={{ borderRadius: 1 }} />
                                <Skeleton variant="rectangular" width="100%" height={36} sx={{ borderRadius: 1 }} />
                            </Box>
                        </Paper>

                        {/* Low Stock Alert Skeleton */}
                        <Paper sx={{ p: 3 }}>
                            <Skeleton variant="text" width={130} height={32} sx={{ mb: 1 }} />
                            <Skeleton variant="text" width={200} height={20} sx={{ mb: 2 }} />
                            {Array(3).fill(0).map((_, index) => (
                                <Box key={index} sx={{ mb: 1 }}>
                                    <Skeleton variant="text" width="80%" height={20} sx={{ mb: 0.5 }} />
                                    <Skeleton variant="rectangular" width={60} height={24} sx={{ borderRadius: 3 }} />
                                </Box>
                            ))}
                        </Paper>
                    </Grid>

                    <Grid item xs={12}>
                        <Paper sx={{ p: 3 }}>
                            <Skeleton variant="text" width={150} height={32} sx={{ mb: 2 }} />
                            <Grid container spacing={2}>
                                {Array(3).fill(0).map((_, index) => (
                                    <Grid item xs={12} sm={6} md={4} key={index}>
                                        <Card variant="outlined">
                                            <CardContent>
                                                <Skeleton variant="text" width="70%" height={28} sx={{ mb: 1 }} />
                                                <Skeleton variant="text" width="40%" height={20} sx={{ mb: 1 }} />
                                                <Skeleton variant="rectangular" width={60} height={24} sx={{ borderRadius: 3 }} />
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        );
    }

    const hasErrors = analyticsError || productsError || ordersError;
    if (hasErrors) {
        return (
            <Box>
                <Alert severity="error" sx={{ mb: 3 }}>
                    Failed to load dashboard data. Please try refreshing the page.
                </Alert>
                <Typography variant="h4" color="primary" gutterBottom fontWeight="bold">
                    Welcome back, {userInfo?.name || 'Seller'}!
                </Typography>
            </Box>
        );
    }

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Box>
                    <Typography variant="h4" color="primary" fontWeight="bold">
                        Welcome back, {userInfo?.name}!
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Here's what's happening with your store today
                    </Typography>
                </Box>
                <IconButton
                    onClick={handleRefreshAll}
                    color="primary"
                    size="small"
                    disabled={isRefreshing}
                    sx={{
                        bgcolor: 'background.paper',
                        boxShadow: 1,
                        '&:hover': { boxShadow: 2 },
                        border: '1px solid',
                        borderColor: 'primary.light',
                        '&:disabled': {
                            bgcolor: 'rgba(0, 0, 0, 0.12)',
                            borderColor: 'rgba(0, 0, 0, 0.12)',
                        }
                    }}
                    title="Refresh Dashboard"
                >
                    <Refresh sx={{
                        animation: isRefreshing ? 'spin 1s linear infinite' : 'none',
                        '@keyframes spin': {
                            '0%': { transform: 'rotate(0deg)' },
                            '100%': { transform: 'rotate(360deg)' }
                        }
                    }} />
                </IconButton>
            </Box>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography color="text.secondary" gutterBottom>
                                        Total Revenue
                                    </Typography>
                                    <Typography variant="h4" color="primary" component="div">
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
                                    <Typography variant="h4" color="primary" component="div">
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
                                    <Typography variant="h4" color="primary" component="div">
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
                                    <Typography variant="h4" color="primary" component="div">
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
                <Grid item xs={12} md={8}>
                    <Paper
                        sx={{
                            p: 4,
                            borderRadius: 3,
                            background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                            border: '1px solid rgba(0, 0, 0, 0.08)',
                        }}
                    >
                        <Box sx={{ mb: 3 }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                                <Box>
                                    <Typography
                                        variant="h5"
                                        sx={{
                                            fontWeight: 700,
                                            color: variables['--color-text-primary'],
                                            mb: 1,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1
                                        }}
                                    >
                                        <ShowChart sx={{ color: variables['--primary-aims-main'] }} />
                                        Sales Analytics
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: variables['--color-text-secondary']
                                        }}
                                    >
                                        Track your revenue performance over time
                                    </Typography>
                                </Box>

                                <Stack direction="row" spacing={1} alignItems="center">
                                    <IconButton
                                        onClick={handleScrollLeft}
                                        disabled={!canScrollLeft}
                                        size="small"
                                        sx={{
                                            bgcolor: 'background.paper',
                                            boxShadow: 1,
                                            '&:hover': { boxShadow: 2 },
                                            '&:disabled': { bgcolor: 'rgba(0, 0, 0, 0.05)' }
                                        }}
                                    >
                                        <ChevronLeft />
                                    </IconButton>
                                    <IconButton
                                        onClick={handleScrollRight}
                                        disabled={!canScrollRight}
                                        size="small"
                                        sx={{
                                            bgcolor: 'background.paper',
                                            boxShadow: 1,
                                            '&:hover': { boxShadow: 2 },
                                            '&:disabled': { bgcolor: 'rgba(0, 0, 0, 0.05)' }
                                        }}
                                    >
                                        <ChevronRight />
                                    </IconButton>
                                </Stack>
                            </Stack>

                            {/* Period Summary */}
                            <Box
                                sx={{
                                    mb: 3,
                                    p: 2,
                                    bgcolor: variables['--primary-aims-main'],
                                    borderRadius: 2,
                                    color: 'white',
                                    background: `linear-gradient(135deg, ${variables['--primary-aims-main']} 0%, ${variables['--primary-aims-dark']} 100%)`
                                }}
                            >
                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                    <Box>
                                        <Typography variant="body2" sx={{ opacity: 0.9, mb: 0.5 }}>
                                            {periodSummary.period} Revenue
                                        </Typography>
                                        <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                            ${periodSummary.total.toLocaleString()}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ textAlign: 'right' }}>
                                        <Typography variant="body2" sx={{ opacity: 0.9, mb: 0.5 }}>
                                            Total Orders
                                        </Typography>
                                        <Typography variant="h5" sx={{ fontWeight: 600 }}>
                                            {periodSummary.orders}
                                        </Typography>
                                    </Box>
                                </Stack>
                            </Box>

                            <ButtonGroup
                                variant="outlined"
                                size="small"
                                sx={{
                                    '& .MuiButton-root': {
                                        color: variables['--color-text-secondary'],
                                        borderColor: 'rgba(0, 0, 0, 0.12)',
                                        '&:hover': {
                                            borderColor: variables['--primary-aims-light'],
                                            color: variables['--primary-aims-main'],
                                            bgcolor: 'rgba(13, 128, 243, 0.04)',
                                        }
                                    },
                                    '& .MuiButton-root.Mui-selected': {
                                        backgroundColor: variables['--primary-aims-main'],
                                        color: 'white',
                                        borderColor: variables['--primary-aims-main'],
                                        '&:hover': {
                                            backgroundColor: variables['--primary-aims-dark'],
                                        }
                                    }
                                }}
                            >
                                {(['1D', '1W', '1M', '3M', '6M', '1Y', 'ALL'] as const).map((period) => (
                                    <Button
                                        key={period}
                                        onClick={() => setSelectedPeriod(period)}
                                        className={selectedPeriod === period ? 'Mui-selected' : ''}
                                    >
                                        {period}
                                    </Button>
                                ))}
                            </ButtonGroup>
                        </Box>

                        <ResponsiveContainer width="100%" height={400}>
                            <AreaChart
                                data={getVisibleData()}
                                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                            >
                                <defs>
                                    <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop
                                            offset="0%"
                                            stopColor={variables['--primary-aims-main']}
                                            stopOpacity={0.3}
                                        />
                                        <stop
                                            offset="100%"
                                            stopColor={variables['--primary-aims-main']}
                                            stopOpacity={0.05}
                                        />
                                    </linearGradient>
                                </defs>

                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="rgba(0, 0, 0, 0.1)"
                                    strokeOpacity={0.5}
                                />

                                <XAxis
                                    dataKey="name"
                                    stroke={variables['--color-text-secondary']}
                                    fontSize={12}
                                    fontWeight={500}
                                    axisLine={false}
                                    tickLine={false}
                                    dy={10}
                                />

                                <YAxis
                                    stroke={variables['--color-text-secondary']}
                                    fontSize={12}
                                    fontWeight={500}
                                    axisLine={false}
                                    tickLine={false}
                                    dx={-10}
                                    tickFormatter={(value) => value > 1000 ? `$${(value / 1000).toFixed(0)}K` : `$${value}`}
                                />

                                <Tooltip
                                    content={CustomTooltip}
                                />

                                <Area
                                    type="monotone"
                                    dataKey="sales"
                                    stroke={variables['--primary-aims-main']}
                                    strokeWidth={3}
                                    fill="url(#salesGradient)"
                                    dot={{
                                        fill: variables['--primary-aims-main'],
                                        strokeWidth: 2,
                                        stroke: '#ffffff',
                                        r: 5
                                    }}
                                    activeDot={{
                                        r: 7,
                                        fill: variables['--primary-aims-main'],
                                        stroke: '#ffffff',
                                        strokeWidth: 3,
                                    }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>

                        <Box sx={{ mt: 2, textAlign: 'center' }}>
                            <Typography variant="caption" sx={{ color: variables['--color-text-secondary'] }}>
                                📊 Showing real sales data • Use ← → to navigate through time periods
                                {selectedPeriod === '1D' && ' • Hourly breakdown for today'}
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>

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

                {/* Only show Recent Orders section if there are orders */}
                {orders?.length > 0 && (
                    <Grid item xs={12}>
                        <Paper sx={{ p: 3 }}>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                                <Typography variant="h6" fontWeight="bold">
                                    Recent Orders
                                </Typography>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={handleViewOrders}
                                    sx={{
                                        borderColor: variables['--primary-aims-light'],
                                        color: variables['--primary-aims-main'],
                                        '&:hover': {
                                            borderColor: variables['--primary-aims-main'],
                                            bgcolor: 'rgba(13, 128, 243, 0.04)',
                                        }
                                    }}
                                >
                                    View All Orders
                                </Button>
                            </Box>
                            <Grid container spacing={2}>
                                {recentOrders?.map((order: any) => (
                                    <Grid item xs={12} sm={6} md={4} key={order?._id || Math.random()}>
                                        <Card
                                            variant="outlined"
                                            sx={{
                                                transition: 'all 0.2s ease-in-out',
                                                '&:hover': {
                                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                                    transform: 'translateY(-2px)',
                                                    borderColor: variables['--primary-aims-light'],
                                                }
                                            }}
                                        >
                                            <CardContent sx={{ pb: 1 }}>
                                                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                                                    <Box>
                                                        <Typography variant="h6" component="div" fontWeight="bold">
                                                            Order #{order?._id?.slice(-8) || 'N/A'}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                                            {order?.createdAt ? new Date(order.createdAt).toLocaleDateString('en-US', {
                                                                month: 'short',
                                                                day: 'numeric',
                                                                year: 'numeric'
                                                            }) : 'Date N/A'}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.primary" sx={{ fontWeight: 500 }}>
                                                            {order?.user?.name || order?.shippingAddress?.fullName || 'Customer N/A'}
                                                        </Typography>
                                                    </Box>
                                                    <Chip
                                                        label={order?.isPaid ? "Paid" : "Pending"}
                                                        color={order?.isPaid ? "success" : "warning"}
                                                        size="small"
                                                        sx={{ fontWeight: 500 }}
                                                    />
                                                </Box>

                                                <Box mb={2}>
                                                    <Typography variant="h5" color="primary" fontWeight="bold">
                                                        ${order?.totalPrice?.toFixed(2) || '0.00'}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {order?.orderItems?.length || 0} item{(order?.orderItems?.length || 0) !== 1 ? 's' : ''}
                                                    </Typography>
                                                </Box>

                                                <Box display="flex" gap={1} flexWrap="wrap">
                                                    <Button
                                                        variant="contained"
                                                        size="small"
                                                        startIcon={<Visibility />}
                                                        onClick={() => handleViewOrder(order)}
                                                        sx={{
                                                            flex: 1,
                                                            minWidth: '100px',
                                                            bgcolor: variables['--primary-aims-main'],
                                                            '&:hover': {
                                                                bgcolor: variables['--primary-aims-dark'],
                                                            }
                                                        }}
                                                    >
                                                        View Details
                                                    </Button>
                                                    {!order?.isPaid && (
                                                        <Button
                                                            variant="outlined"
                                                            size="small"
                                                            sx={{
                                                                flex: 1,
                                                                minWidth: '100px',
                                                                borderColor: variables['--color-warning'],
                                                                color: variables['--color-warning'],
                                                                '&:hover': {
                                                                    borderColor: variables['--color-warning'],
                                                                    bgcolor: 'rgba(255, 152, 0, 0.04)',
                                                                }
                                                            }}
                                                        >
                                                            Follow Up
                                                        </Button>
                                                    )}
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </Paper>
                    </Grid>
                )}
            </Grid>

            {/* Order Details Dialog */}
            <Dialog
                open={openOrderDialog}
                onClose={() => setOpenOrderDialog(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    Order Details - #{selectedOrder?._id?.slice(-8)}
                </DialogTitle>
                <DialogContent>
                    {selectedOrder && (
                        <Box>
                            {/* Customer Information */}
                            <Typography variant="h6" gutterBottom>
                                Customer Information
                            </Typography>
                            <Typography variant="body2">
                                Name: {selectedOrder.user?.name || selectedOrder.shippingAddress?.fullName}
                            </Typography>
                            <Typography variant="body2">
                                Email: {selectedOrder.user?.email}
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                                Phone: {selectedOrder.shippingAddress?.contactNo}
                            </Typography>

                            <Divider sx={{ my: 2 }} />

                            {/* Shipping Address */}
                            <Typography variant="h6" gutterBottom>
                                Shipping Address
                            </Typography>
                            <Typography variant="body2">
                                {selectedOrder.shippingAddress?.address}
                            </Typography>
                            <Typography variant="body2">
                                {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.postalCode}
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                                {selectedOrder.shippingAddress?.country}
                            </Typography>

                            <Divider sx={{ my: 2 }} />

                            {/* Order Items */}
                            <Typography variant="h6" gutterBottom>
                                Order Items
                            </Typography>
                            <List>
                                {selectedOrder.orderItems?.map((item: any, index: number) => {
                                    // Validate image URL and provide fallback
                                    const getValidImageSrc = (imageSrc: string) => {
                                        if (!imageSrc || imageSrc === "sad") return null;
                                        if (imageSrc.startsWith('http://') || imageSrc.startsWith('https://')) {
                                            return imageSrc;
                                        }
                                        if (imageSrc.startsWith('/')) {
                                            return imageSrc;
                                        }
                                        return null;
                                    };

                                    const validImageSrc = getValidImageSrc(item.image);

                                    return (
                                        <ListItem key={index}>
                                            <ListItemAvatar>
                                                <Avatar
                                                    src={validImageSrc || undefined}
                                                    alt={item.name}
                                                    sx={{
                                                        bgcolor: !validImageSrc ? 'primary.main' : undefined,
                                                        color: !validImageSrc ? 'white' : undefined
                                                    }}
                                                >
                                                    {!validImageSrc && item.name?.charAt(0)?.toUpperCase()}
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={item.name}
                                                secondary={`Quantity: ${item.quantity} | Price: $${item.price}`}
                                            />
                                            <Typography variant="body2">
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </Typography>
                                        </ListItem>
                                    );
                                })}
                            </List>

                            <Divider sx={{ my: 2 }} />

                            {/* Order Summary */}
                            <Typography variant="h6" gutterBottom>
                                Order Summary
                            </Typography>
                            <Box display="flex" justifyContent="space-between">
                                <Typography>Total Amount:</Typography>
                                <Typography variant="h6" color="primary">
                                    ${selectedOrder.totalPrice?.toFixed(2)}
                                </Typography>
                            </Box>
                            <Box display="flex" justifyContent="space-between">
                                <Typography>Payment Status:</Typography>
                                <Chip
                                    label={selectedOrder.isPaid ? "Paid" : "Pending"}
                                    color={selectedOrder.isPaid ? "success" : "warning"}
                                    size="small"
                                />
                            </Box>
                            <Box display="flex" justifyContent="space-between">
                                <Typography>Delivery Status:</Typography>
                                <Chip
                                    label={selectedOrder.isDelivered ? "Delivered" : "Pending"}
                                    color={selectedOrder.isDelivered ? "success" : "warning"}
                                    size="small"
                                />
                            </Box>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenOrderDialog(false)}>Close</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default SellerOverviewLayout;
