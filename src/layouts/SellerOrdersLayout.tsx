import React, { useState, useEffect } from "react";
import {
    useGetSellerOrdersQuery,
    useUpdateOrderStatusMutation,
} from "src/store/seller.slice";
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Chip,
    Button,
    Avatar,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Pagination,
    Alert,
    Skeleton,
    IconButton,
} from "@mui/material";
import {
    LocalShipping,
    CheckCircle,
    Pending,
    Visibility,
    Update,
    Refresh,
} from "@mui/icons-material";
import { useSelector } from "react-redux";
import SearchBar from "src/components/bars/SearchBar";

const SellerOrdersLayout: React.FC = () => {
    const { orders } = useSelector((state: any) => state.seller);
    const { loading } = useSelector((state: any) => state.app);

    const { error: ordersError, refetch: refetchOrders } = useGetSellerOrdersQuery({}, {});
    const [reqUpdateOrderStatus] = useUpdateOrderStatusMutation();

    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [ordersPerPage] = useState(6);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [openOrderDialog, setOpenOrderDialog] = useState(false);

    const ordersData = orders || [];

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        setCurrentPage(1);
    };

    const handleViewOrder = (order: any) => {
        setSelectedOrder(order);
        setOpenOrderDialog(true);
    };

    const handleUpdateOrderStatus = async (orderId: string, status: string) => {
        try {
            await reqUpdateOrderStatus({
                orderId,
                status,
                isDelivered: status === "delivered",
                deliveredAt: status === "delivered" ? new Date().toISOString() : undefined
            }).unwrap();

            refetchOrders();
        } catch (error) {
            console.error("Error updating order status:", error);
        }
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

    const getOrderStatusColor = (order: any) => {
        if (order.isPaid && order.isDelivered) return "success";
        if (order.isPaid) return "warning";
        return "error";
    };

    const getOrderStatusText = (order: any) => {
        if (order.isPaid && order.isDelivered) return "Completed";
        if (order.isPaid) return "Processing";
        return "Pending Payment";
    };

    const filteredOrders = ordersData?.filter((order: any) =>
        order?._id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order?.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order?.shippingAddress?.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setCurrentPage(value);
    };

    const renderSkeletonCards = () => {
        return Array(6).fill(0).map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <Skeleton variant="text" width="60%" height={32} />
                            <Skeleton variant="rectangular" width={80} height={24} sx={{ borderRadius: 3 }} />
                        </Box>

                        <Skeleton variant="text" width="70%" height={20} sx={{ mb: 1 }} />
                        <Skeleton variant="text" width="60%" height={20} sx={{ mb: 1 }} />
                        <Skeleton variant="text" width="40%" height={20} sx={{ mb: 1 }} />
                        <Skeleton variant="text" width="50%" height={32} sx={{ mb: 2 }} />

                        <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                            <Box display="flex" gap={1}>
                                <Skeleton variant="circular" width={20} height={20} />
                                <Skeleton variant="circular" width={20} height={20} />
                            </Box>
                        </Box>
                    </CardContent>

                    <Box display="flex" justifyContent="space-between" p={2}>
                        <Skeleton variant="rectangular" width={100} height={32} sx={{ borderRadius: 1 }} />
                        <Skeleton variant="rectangular" width={120} height={32} sx={{ borderRadius: 1 }} />
                    </Box>
                </Card>
            </Grid>
        ));
    };

    // Show loading state
    if (loading) {
        return (
            <Box>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Skeleton variant="text" width={200} height={48} />
                </Box>

                <Skeleton variant="rectangular" width="100%" height={56} sx={{ mb: 3 }} />

                <Grid container spacing={3} sx={{ mt: 1 }}>
                    {renderSkeletonCards()}
                </Grid>
            </Box>
        );
    }

    // Show error state
    if (ordersError) {
        return (
            <Box>
                <Alert severity="error" sx={{ mb: 3 }}>
                    Failed to load orders. Please try refreshing the page.
                </Alert>
            </Box>
        );
    }

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" color="primary" fontWeight="bold">
                    Orders ({ordersData.length})
                </Typography>
                <IconButton
                    onClick={refetchOrders}
                    color="primary"
                    size="small"
                    sx={{
                        bgcolor: 'background.paper',
                        boxShadow: 1,
                        '&:hover': { boxShadow: 2 },
                        border: '1px solid',
                        borderColor: 'primary.light'
                    }}
                    title="Refresh Orders"
                >
                    <Refresh />
                </IconButton>
            </Box>

            <SearchBar onSearch={handleSearch} placeholder="Search orders..." />

            <Grid container spacing={3} sx={{ mt: 1 }}>
                {currentOrders.length > 0 ? (
                    currentOrders.map((order: any) => (
                        <Grid item xs={12} sm={6} md={4} key={order?._id || Math.random()}>
                            <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                        <Typography variant="h6" component="div">
                                            Order #{order?._id?.slice(-8) || 'N/A'}
                                        </Typography>
                                        <Chip
                                            label={getOrderStatusText(order)}
                                            color={getOrderStatusColor(order)}
                                            size="small"
                                        />
                                    </Box>

                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        Order Date: {order?.createdAt ? formatDate(order.createdAt) : 'N/A'}
                                    </Typography>

                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        Customer: {order?.user?.name || order?.shippingAddress?.fullName || 'N/A'}
                                    </Typography>

                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        Items: {order?.orderItems?.length || 0}
                                    </Typography>

                                    <Typography variant="h6" color="primary" gutterBottom>
                                        Total: ${order?.totalPrice?.toFixed(2) || '0.00'}
                                    </Typography>

                                    <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                                        <Box display="flex" gap={1}>
                                            {order?.isPaid ? (
                                                <CheckCircle color="success" fontSize="small" />
                                            ) : (
                                                <Pending color="warning" fontSize="small" />
                                            )}
                                            {order?.isDelivered ? (
                                                <LocalShipping color="success" fontSize="small" />
                                            ) : (
                                                <LocalShipping color="disabled" fontSize="small" />
                                            )}
                                        </Box>
                                    </Box>
                                </CardContent>

                                <Box display="flex" justifyContent="space-between" p={2}>
                                    <Button
                                        startIcon={<Visibility />}
                                        onClick={() => handleViewOrder(order)}
                                        size="small"
                                    >
                                        View Details
                                    </Button>
                                    {order?.isPaid && !order?.isDelivered && (
                                        <Button
                                            startIcon={<Update />}
                                            color="primary"
                                            size="small"
                                            onClick={() => handleUpdateOrderStatus(order._id, "delivered")}
                                        >
                                            Mark Delivered
                                        </Button>
                                    )}
                                </Box>
                            </Card>
                        </Grid>
                    ))
                ) : (
                    <Grid item xs={12}>
                        <Box textAlign="center" py={8}>
                            <Typography variant="h6" color="text.secondary" gutterBottom>
                                No orders found
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {searchQuery
                                    ? "Try adjusting your search terms"
                                    : "Orders will appear here once customers start purchasing your products"}
                            </Typography>
                        </Box>
                    </Grid>
                )}
            </Grid>

            {filteredOrders.length > ordersPerPage && (
                <Box display="flex" justifyContent="center" mt={4}>
                    <Pagination
                        count={Math.ceil(filteredOrders.length / ordersPerPage)}
                        page={currentPage}
                        onChange={handlePageChange}
                        color="primary"
                    />
                </Box>
            )}

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
                                {selectedOrder.orderItems?.map((item: any, index: number) => (
                                    <ListItem key={index}>
                                        <ListItemAvatar>
                                            <Avatar src={item.image} alt={item.name} />
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={item.name}
                                            secondary={`Quantity: ${item.quantity} | Price: $${item.price}`}
                                        />
                                        <Typography variant="body2">
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </Typography>
                                    </ListItem>
                                ))}
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
                    {selectedOrder?.isPaid && !selectedOrder?.isDelivered && (
                        <Button
                            variant="contained"
                            onClick={() => {
                                handleUpdateOrderStatus(selectedOrder._id, "delivered");
                                setOpenOrderDialog(false);
                            }}
                        >
                            Mark as Delivered
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default SellerOrdersLayout;
