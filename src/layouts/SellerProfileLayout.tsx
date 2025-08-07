import React, { useState } from "react";
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Avatar,
    Divider,
    Switch,
    FormControlLabel,
    Paper,
    Skeleton,
} from "@mui/material";
import {
    Person,
    Store,
    LocationOn,
    Phone,
    Email,
    BusinessCenter,
} from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as yup from "yup";
import { useUpdateSellerProfileMutation, setSellerInfo } from "@store/seller.slice";
import { updateUserInfo, useUpdateProfileMutation } from "@store/user.slice";

const profileValidationSchema = yup.object({
    name: yup.string().required("Name is required"),
    storeName: yup.string().required("Store name is required"),
    phone: yup.string(),
    address: yup.string(),
    city: yup.string(),
    country: yup.string(),
    isActiveStore: yup.boolean(),
});

const SellerProfileLayout: React.FC = () => {
    const dispatch = useDispatch();
    const { userInfo } = useSelector((state: any) => state.user);
    const { sellerInfo, orders, products } = useSelector((state: any) => state.seller);
    const { loading } = useSelector((state: any) => state.app);
    const [updateSellerProfile, { isLoading: isUpdating }] = useUpdateSellerProfileMutation();
    const [updateProfile] = useUpdateProfileMutation();

    const [isEditing, setIsEditing] = useState(false);

    const formik = useFormik({
        initialValues: {
            name: userInfo?.name || "",
            email: userInfo?.email || "",
            storeName: userInfo?.storeName || sellerInfo?.storeName || "",
            phone: userInfo?.phone || sellerInfo?.phone || "",
            address: userInfo?.address || sellerInfo?.address || "",
            city: userInfo?.city || sellerInfo?.city || "",
            country: userInfo?.country || sellerInfo?.country || "",
            isActiveStore: userInfo?.isActiveStore !== undefined ? userInfo.isActiveStore : true,
        },
        validationSchema: profileValidationSchema,
        onSubmit: async (values) => {
            try {
                const { email, ...updateData } = values;

                // Prepare payloads for both APIs
                const userPayload = {
                    name: values.name,
                    phone: values.phone,
                    address: values.address,
                    city: values.city,
                    country: values.country,
                    isActiveStore: values.isActiveStore,
                };

                const sellerPayload = {
                    userId: userInfo?._id,
                    ...updateData
                };

                // Call both APIs
                await Promise.all([
                    updateProfile(userPayload).unwrap(),
                    updateSellerProfile(sellerPayload).unwrap()
                ]);

                // Update both states
                const updatedUserInfo = { ...userInfo, ...userPayload };
                const updatedSellerInfo = { ...sellerInfo, ...updateData };

                dispatch(updateUserInfo(updatedUserInfo));
                dispatch(setSellerInfo(updatedSellerInfo));

                setIsEditing(false);
                console.log("Profile updated successfully:", { userPayload, sellerPayload });
            } catch (error) {
                console.error("Error updating profile:", error);
            }
        },
        enableReinitialize: true,
    });

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        formik.resetForm();
    };

    const calculateStats = () => {
        const ordersData = orders || [];
        const productsData = products || [];

        const totalRevenue = ordersData
            .filter((order: any) => order?.isPaid)
            .reduce((sum: number, order: any) => sum + (order?.totalPrice || 0), 0);

        const activeProducts = productsData.filter((product: any) =>
            (product?.countInStock || 0) > 0
        ).length;

        const totalReviews = productsData.reduce((sum: number, product: any) =>
            sum + (product?.reviews?.length || 0), 0
        );

        const allRatings = productsData.flatMap((product: any) =>
            product?.reviews?.map((review: any) => review?.rating || 0) || []
        );
        const averageRating = allRatings.length > 0
            ? (allRatings.reduce((sum: number, rating: number) => sum + rating, 0) / allRatings.length)
            : 0;

        return {
            totalRevenue,
            totalOrders: ordersData.length,
            activeProducts,
            totalReviews,
            averageRating
        };
    };

    const stats = calculateStats();

    const statsCards = [
        {
            title: "Store Rating",
            value: stats.averageRating > 0 ? `${stats.averageRating.toFixed(1)}/5` : "No ratings",
            icon: <Store />,
            color: "primary",
        },
        {
            title: "Total Revenue",
            value: `$${stats.totalRevenue.toFixed(2)}`,
            icon: <BusinessCenter />,
            color: "success",
        },
        {
            title: "Active Products",
            value: stats.activeProducts.toString(),
            icon: <Store />,
            color: "info",
        },
        {
            title: "Customer Reviews",
            value: stats.totalReviews.toString(),
            icon: <Person />,
            color: "warning",
        },
    ];

    if (loading || isUpdating) {
        return (
            <Box>
                <Typography variant="h4" color="primary" component="div">
                    <Skeleton width={200} height={40} />
                </Typography>

                <Grid container spacing={3} sx={{ mt: 0 }}>
                    <Grid item xs={12} md={8}>
                        <Card>
                            <CardContent>
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                                    <Skeleton variant="text" width={150} height={32} />
                                    <Skeleton variant="rectangular" width={100} height={36} sx={{ borderRadius: 1 }} />
                                </Box>

                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <Skeleton variant="rectangular" width="100%" height={56} sx={{ borderRadius: 1 }} />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Skeleton variant="rectangular" width="100%" height={56} sx={{ borderRadius: 1 }} />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Skeleton variant="rectangular" width="100%" height={56} sx={{ borderRadius: 1 }} />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Skeleton variant="rectangular" width="100%" height={56} sx={{ borderRadius: 1 }} />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Skeleton variant="rectangular" width="100%" height={56} sx={{ borderRadius: 1 }} />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Skeleton variant="rectangular" width="100%" height={56} sx={{ borderRadius: 1 }} />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Skeleton variant="rectangular" width="100%" height={56} sx={{ borderRadius: 1 }} />
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Card sx={{ mb: 3 }}>
                            <CardContent sx={{ textAlign: "center" }}>
                                <Skeleton
                                    variant="circular"
                                    width={100}
                                    height={100}
                                    sx={{ mx: "auto", mb: 2 }}
                                />
                                <Skeleton variant="text" width={120} height={32} sx={{ mx: "auto", mb: 1 }} />
                                <Skeleton variant="text" width={100} height={20} sx={{ mx: "auto", mb: 1 }} />
                                <Skeleton variant="text" width={120} height={16} sx={{ mx: "auto" }} />
                            </CardContent>
                        </Card>

                        <Card sx={{ mb: 3 }}>
                            <CardContent>
                                <Skeleton variant="text" width={120} height={32} sx={{ mb: 2 }} />
                                <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                                    <Skeleton variant="text" width={90} height={24} />
                                    <Skeleton variant="rectangular" width={58} height={38} sx={{ borderRadius: 3 }} />
                                </Box>
                                <Skeleton variant="text" width="100%" height={20} />
                            </CardContent>
                        </Card>

                        <Paper sx={{ p: 2 }}>
                            <Skeleton variant="text" width={100} height={32} sx={{ mb: 2 }} />
                            {[1, 2, 3, 4].map((index) => (
                                <Box key={index} sx={{ mb: index < 4 ? 2 : 0 }}>
                                    <Box display="flex" alignItems="center" justifyContent="space-between">
                                        <Box display="flex" alignItems="center">
                                            <Skeleton variant="circular" width={24} height={24} />
                                            <Skeleton variant="text" width={100} height={20} sx={{ ml: 1 }} />
                                        </Box>
                                        <Skeleton variant="text" width={60} height={28} />
                                    </Box>
                                    {index < 4 && <Divider sx={{ mt: 2 }} />}
                                </Box>
                            ))}
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        );
    } return (
        <Box>
            <Typography variant="h4" color="primary" fontWeight="bold" gutterBottom>
                Seller Profile
            </Typography>

            <Grid container spacing={3}>
                {/* Profile Information */}
                <Grid item xs={12} md={8}>
                    <Card>
                        <CardContent>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                                <Typography variant="h6">Personal Information</Typography>
                                {!isEditing && (
                                    <Button variant="outlined" onClick={handleEdit}>
                                        Edit Profile
                                    </Button>
                                )}
                            </Box>

                            <form onSubmit={formik.handleSubmit}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Full Name"
                                            name="name"
                                            value={formik.values.name}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={Boolean(formik.touched.name && formik.errors.name)}
                                            helperText={formik.touched.name && (formik.errors.name as string)}
                                            disabled={!isEditing}
                                            InputProps={{
                                                startAdornment: <Person sx={{ mr: 1, color: "action.active" }} />,
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Email"
                                            name="email"
                                            type="email"
                                            value={formik.values.email}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={Boolean(formik.touched.email && formik.errors.email)}
                                            helperText={formik.touched.email && (formik.errors.email as string)}
                                            disabled={true}
                                            InputProps={{
                                                startAdornment: <Email sx={{ mr: 1, color: "action.active" }} />,
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Phone"
                                            name="phone"
                                            value={formik.values.phone}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            disabled={!isEditing}
                                            InputProps={{
                                                startAdornment: <Phone sx={{ mr: 1, color: "action.active" }} />,
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Store Name"
                                            name="storeName"
                                            value={formik.values.storeName}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={Boolean(formik.touched.storeName && formik.errors.storeName)}
                                            helperText={formik.touched.storeName && (formik.errors.storeName as string)}
                                            disabled={!isEditing}
                                            InputProps={{
                                                startAdornment: <Store sx={{ mr: 1, color: "action.active" }} />,
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Address"
                                            name="address"
                                            value={formik.values.address}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            disabled={!isEditing}
                                            InputProps={{
                                                startAdornment: <LocationOn sx={{ mr: 1, color: "action.active" }} />,
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="City"
                                            name="city"
                                            value={formik.values.city}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            disabled={!isEditing}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Country"
                                            name="country"
                                            value={formik.values.country}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            disabled={!isEditing}
                                        />
                                    </Grid>
                                </Grid>

                                {isEditing && (
                                    <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
                                        <Button variant="outlined" onClick={handleCancel} disabled={isUpdating}>
                                            Cancel
                                        </Button>
                                        <Button type="submit" variant="contained" disabled={isUpdating}>
                                            {isUpdating ? "Saving..." : "Save Changes"}
                                        </Button>
                                    </Box>
                                )}
                            </form>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card sx={{ mb: 3 }}>
                        <CardContent sx={{ textAlign: "center" }}>
                            <Avatar
                                sx={{
                                    width: 100,
                                    height: 100,
                                    mx: "auto",
                                    mb: 2,
                                    bgcolor: "primary.main",
                                    fontSize: "2rem",
                                }}
                            >
                                {userInfo?.name?.charAt(0)?.toUpperCase()}
                            </Avatar>
                            <Typography variant="h6" gutterBottom>
                                {userInfo?.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                {formik.values.storeName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Seller since {new Date().getFullYear()}
                            </Typography>
                        </CardContent>
                    </Card>

                    {/* Store Settings */}
                    <Card sx={{ mb: 3 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Store Settings
                            </Typography>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={formik.values.isActiveStore}
                                        onChange={(e) => formik.setFieldValue('isActiveStore', e.target.checked)}
                                        disabled={!isEditing}
                                    />
                                }
                                label="Store Active"
                            />
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                {formik.values.isActiveStore
                                    ? "Your store is visible to customers"
                                    : "Your store is temporarily hidden"}
                            </Typography>
                            {isEditing && (
                                <Typography variant="caption" color="primary" sx={{ mt: 1, display: 'block' }}>
                                    Toggle to activate/deactivate your store visibility
                                </Typography>
                            )}
                        </CardContent>
                    </Card>

                    {/* Quick Stats */}
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Quick Stats
                        </Typography>
                        {statsCards.map((stat, index) => (
                            <Box key={index} sx={{ mb: index < statsCards.length - 1 ? 2 : 0 }}>
                                <Box display="flex" alignItems="center" justifyContent="space-between">
                                    <Box display="flex" alignItems="center">
                                        {stat.icon}
                                        <Typography variant="body2" sx={{ ml: 1 }}>
                                            {stat.title}
                                        </Typography>
                                    </Box>
                                    <Typography variant="h6" color={`${stat.color}.main`}>
                                        {stat.value}
                                    </Typography>
                                </Box>
                                {index < statsCards.length - 1 && <Divider sx={{ mt: 2 }} />}
                            </Box>
                        ))}
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default SellerProfileLayout;
