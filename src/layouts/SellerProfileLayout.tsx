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
import { useUpdateSellerProfileMutation } from "@store/seller.slice";
import { updateUserInfo } from "@store/user.slice";
import LoadingOverlay from "src/components/loaders/TextLoader";

const profileValidationSchema = yup.object({
    name: yup.string().required("Name is required"),
    storeName: yup.string().required("Store name is required"),
    storeDescription: yup.string(),
    phone: yup.string(),
    address: yup.string(),
    city: yup.string(),
    country: yup.string(),
});

const SellerProfileLayout: React.FC = () => {
    const dispatch = useDispatch();
    const { userInfo } = useSelector((state: any) => state.user);
    const { loading } = useSelector((state: any) => state.app);
    const [updateSellerProfile, { isLoading: isUpdating }] = useUpdateSellerProfileMutation();

    const [isEditing, setIsEditing] = useState(false);
    const [storeActive, setStoreActive] = useState(true);

    const formik = useFormik({
        initialValues: {
            name: userInfo?.name || "",
            email: userInfo?.email || "",
            storeName: userInfo?.storeName || "",
            storeDescription: userInfo?.storeDescription || "",
            phone: userInfo?.phone || "",
            address: userInfo?.address || "",
            city: userInfo?.city || "",
            country: userInfo?.country || "",
        },
        validationSchema: profileValidationSchema,
        onSubmit: async (values) => {
            try {
                const { email, ...updateData } = values;
                const payload = {
                    userId: userInfo?._id,
                    ...updateData
                };
                await updateSellerProfile(payload).unwrap();
                dispatch(updateUserInfo({ ...userInfo, ...updateData }));
                setIsEditing(false);
                console.log("Profile updated:", payload);
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

    const statsCards = [
        {
            title: "Store Rating",
            value: "4.5/5",
            icon: <Store />,
            color: "primary",
        },
        {
            title: "Total Sales",
            value: "$12,430",
            icon: <BusinessCenter />,
            color: "success",
        },
        {
            title: "Active Products",
            value: "45",
            icon: <Store />,
            color: "info",
        },
        {
            title: "Customer Reviews",
            value: "234",
            icon: <Person />,
            color: "warning",
        },
    ];

    if (loading || isUpdating) {
        return <LoadingOverlay loadingMessage={isUpdating ? "Updating profile..." : "Loading profile..."} />;
    }

    return (
        <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
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
                                            label="Store Description"
                                            name="storeDescription"
                                            multiline
                                            rows={3}
                                            value={formik.values.storeDescription}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            disabled={!isEditing}
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
                                        checked={storeActive}
                                        onChange={(e) => setStoreActive(e.target.checked)}
                                    />
                                }
                                label="Store Active"
                            />
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                {storeActive
                                    ? "Your store is visible to customers"
                                    : "Your store is temporarily hidden"}
                            </Typography>
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
