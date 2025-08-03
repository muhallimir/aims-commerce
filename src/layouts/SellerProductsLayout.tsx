import React, { useState } from "react";
import {
    Box,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Typography,
    Button,
    IconButton,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Alert,
    CircularProgress,
} from "@mui/material";
import {
    Add,
    Edit,
    Delete,
    Visibility,
    VisibilityOff,
} from "@mui/icons-material";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import * as yup from "yup";
import SearchBar from "src/components/bars/SearchBar";
import ConfirmModal from "src/components/modals/ConfirmModal";
import { CONFIRMATIONMESSAGE } from "@common/constants";
import {
    useGetSellerProductsQuery,
    useCreateSellerProductMutation,
    useUpdateSellerProductMutation,
    useDeleteSellerProductMutation,
} from "src/store/seller.slice";

const productValidationSchema = yup.object({
    name: yup.string().required("Product name is required"),
    price: yup.number().required("Price is required").positive("Price must be positive"),
    category: yup.string().required("Category is required"),
    brand: yup.string().required("Brand is required"),
    countInStock: yup.number().required("Stock count is required").min(0, "Must be at least 0"),
    description: yup.string().required("Description is required"),
    image: yup.string().nullable(),
});

const SellerProductsLayout: React.FC = () => {
    const { products } = useSelector((state: any) => state.seller);

    // Add RTK Query hook to enable automatic cache invalidation
    useGetSellerProductsQuery(undefined);

    const [searchQuery, setSearchQuery] = useState("");
    const [openDialog, setOpenDialog] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any>(null);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [imagePreview, setImagePreview] = useState<string>("");
    const [createProduct] = useCreateSellerProductMutation();
    const [updateProduct] = useUpdateSellerProductMutation();
    const [deleteProduct] = useDeleteSellerProductMutation(); const formik = useFormik({
        initialValues: {
            name: "",
            price: 0,
            category: "",
            brand: "",
            countInStock: 0,
            description: "",
            image: "",
        },
        validationSchema: productValidationSchema,
        onSubmit: async (values, { resetForm }) => {
            try {
                setIsLoading(true);
                setError("");

                // Generate fallback image if no image provided
                const productData = {
                    ...values,
                    image: values.image || generateFallbackImage(values.name)
                };

                if (editingProduct) {
                    await updateProduct({
                        productId: editingProduct._id,
                        ...productData
                    }).unwrap();
                    console.log("Product updated successfully");
                } else {
                    await createProduct(productData).unwrap();
                    console.log("Product created successfully");
                }

                resetForm();
                setOpenDialog(false);
                setEditingProduct(null);
                setImagePreview("");

                // RTK Query will automatically refetch data
            } catch (err: any) {
                console.error("Error saving product:", err);
                setError(err?.data?.message || "Failed to save product");
            } finally {
                setIsLoading(false);
            }
        },
        enableReinitialize: true,
    });

    const handleAddProduct = () => {
        setEditingProduct(null);
        formik.resetForm();
        setImagePreview("");
        setOpenDialog(true);
    };

    const handleEditProduct = (product: any) => {
        setEditingProduct(product);
        formik.setValues({
            name: product.name,
            price: product.price,
            category: product.category,
            brand: product.brand,
            countInStock: product.countInStock,
            description: product.description,
            image: product.image || "",
        });
        setImagePreview(product.image || "");
        setOpenDialog(true);
    };

    const handleDeleteProduct = (productId: string) => {
        setProductToDelete(productId);
        setOpenDeleteModal(true);
    };

    const confirmDeleteProduct = async () => {
        try {
            setIsLoading(true);
            setError("");
            await deleteProduct({ productId: productToDelete }).unwrap();
            console.log("Product deleted successfully");
            setOpenDeleteModal(false);

            // RTK Query will automatically refetch data
        } catch (err: any) {
            console.error("Error deleting product:", err);
            setError(err?.data?.message || "Failed to delete product");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    // Image handling functions
    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const result = event.target?.result as string;
                    setImagePreview(result);
                    formik.setFieldValue('image', result);
                };
                reader.readAsDataURL(file);
            }
        }
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const result = event.target?.result as string;
                    setImagePreview(result);
                    formik.setFieldValue('image', result);
                };
                reader.readAsDataURL(file);
            }
        }
    };

    const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const url = e.target.value;
        formik.handleChange(e);
        setImagePreview(url);
    };

    const generateFallbackImage = (productName: string) => {
        const seed = productName.toLowerCase().replace(/\s+/g, '-');
        return `https://picsum.photos/seed/${seed}/400/300`;
    };

    const filteredProducts = products?.filter((product: any) =>
        product?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product?.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product?.brand?.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" fontWeight="bold">
                    Products ({products?.length || 0})
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={handleAddProduct}
                >
                    Add Product
                </Button>
            </Box>

            <SearchBar onSearch={handleSearch} placeholder="Search products..." />

            {error && (
                <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
                    {error}
                </Alert>
            )}

            {isLoading && (
                <Box display="flex" justifyContent="center" my={4}>
                    <CircularProgress />
                </Box>
            )}

            <Grid container spacing={3} sx={{ mt: 1 }}>
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((product: any) => (
                        <Grid item xs={12} sm={6} md={4} key={product?._id || Math.random()}>
                            <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={product?.image || generateFallbackImage(product?.name || 'product')}
                                    alt={product?.name || "Product"}
                                />
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                        <Typography variant="h6" component="div" noWrap>
                                            {product?.name || 'N/A'}
                                        </Typography>
                                        <Chip
                                            icon={product?.isActive ? <Visibility /> : <VisibilityOff />}
                                            label={product?.isActive ? "Active" : "Inactive"}
                                            color={product?.isActive ? "success" : "default"}
                                            size="small"
                                        />
                                    </Box>

                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        {product?.category || 'N/A'} • {product?.brand || 'N/A'}
                                    </Typography>

                                    <Typography variant="h6" color="primary" gutterBottom>
                                        ${product?.price?.toFixed(2) || '0.00'}
                                    </Typography>

                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        Stock: {product?.countInStock || 0}
                                        {(product?.countInStock || 0) < 10 && (
                                            <Chip label="Low Stock" color="warning" size="small" sx={{ ml: 1 }} />
                                        )}
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            display: "-webkit-box",
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: "vertical",
                                        }}
                                    >
                                        {product?.description || 'No description available'}
                                    </Typography>
                                </CardContent>

                                <Box display="flex" justifyContent="space-between" p={2}>
                                    <Button
                                        startIcon={<Edit />}
                                        onClick={() => handleEditProduct(product)}
                                        size="small"
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        startIcon={<Delete />}
                                        color="error"
                                        onClick={() => handleDeleteProduct(product?._id)}
                                        size="small"
                                    >
                                        Delete
                                    </Button>
                                </Box>
                            </Card>
                        </Grid>
                    ))
                ) : (
                    <Grid item xs={12}>
                        <Box textAlign="center" py={8}>
                            <Typography variant="h6" color="text.secondary" gutterBottom>
                                No products found
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                {searchQuery
                                    ? "Try adjusting your search terms"
                                    : "Start by adding your first product to the store"}
                            </Typography>
                            <Button
                                variant="contained"
                                startIcon={<Add />}
                                onClick={handleAddProduct}
                                sx={{ mt: 2 }}
                            >
                                Add Your First Product
                            </Button>
                        </Box>
                    </Grid>
                )}
            </Grid>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
                <form onSubmit={formik.handleSubmit}>
                    <DialogTitle sx={{ pb: 1 }}>
                        <Box display="flex" alignItems="center" justifyContent="space-between">
                            <Typography variant="h5" sx={{ fontWeight: "bold", color: "primary.main" }}>
                                {editingProduct ? "Edit Product" : "Add New Product"}
                            </Typography>
                            <IconButton onClick={() => setOpenDialog(false)} size="small">
                                <Delete />
                            </IconButton>
                        </Box>
                    </DialogTitle>
                    <DialogContent sx={{ pt: 2 }}>
                        {/* Image Upload Section */}
                        <Box sx={{ mb: 4 }}>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold", color: "text.primary" }}>
                                Product Image
                            </Typography>

                            {/* Image Preview */}
                            {(imagePreview || formik.values.name) && (
                                <Box sx={{ mb: 3, textAlign: 'center' }}>
                                    <Box
                                        sx={{
                                            display: 'inline-block',
                                            p: 1,
                                            border: '2px solid',
                                            borderColor: 'primary.light',
                                            borderRadius: 3,
                                            bgcolor: 'background.paper',
                                            boxShadow: 2
                                        }}
                                    >
                                        <img
                                            src={imagePreview || generateFallbackImage(formik.values.name)}
                                            alt="Preview"
                                            style={{
                                                maxWidth: '250px',
                                                maxHeight: '180px',
                                                objectFit: 'cover',
                                                borderRadius: '12px'
                                            }}
                                        />
                                    </Box>
                                    {!imagePreview && formik.values.name && (
                                        <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 1, fontStyle: 'italic' }}>
                                            Auto-generated placeholder (will be used if no image is provided)
                                        </Typography>
                                    )}
                                    {imagePreview && (
                                        <Box sx={{ mt: 1 }}>
                                            <Button
                                                variant="outlined"
                                                color="error"
                                                size="small"
                                                onClick={() => {
                                                    setImagePreview("");
                                                    formik.setFieldValue('image', '');
                                                }}
                                                startIcon={<Delete />}
                                            >
                                                Clear Image
                                            </Button>
                                        </Box>
                                    )}
                                </Box>
                            )}

                            {/* Drag and Drop Area */}
                            <Box
                                sx={{
                                    border: dragActive ? '3px dashed' : '2px dashed',
                                    borderColor: dragActive ? 'primary.main' : 'grey.300',
                                    borderRadius: 3,
                                    p: 4,
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    bgcolor: dragActive ? 'primary.50' : 'grey.50',
                                    mb: 3,
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        borderColor: 'primary.main',
                                        bgcolor: 'primary.50',
                                        transform: 'translateY(-2px)',
                                        boxShadow: 1
                                    }
                                }}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                                onClick={() => document.getElementById('file-input')?.click()}
                            >
                                <input
                                    id="file-input"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileInput}
                                    style={{ display: 'none' }}
                                />
                                <Box sx={{ color: dragActive ? 'primary.main' : 'grey.500' }}>
                                    <Add sx={{ fontSize: 48, mb: 1 }} />
                                    <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
                                        {dragActive ? "Drop your image here" : "Drag & drop an image here"}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                        or click to browse files
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Supports: JPG, PNG, GIF • Max size: 5MB
                                    </Typography>
                                </Box>
                            </Box>

                            {/* Image URL Input and Generate Button */}
                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                                <TextField
                                    fullWidth
                                    name="image"
                                    label="Or enter image URL"
                                    placeholder="https://example.com/image.jpg"
                                    value={formik.values.image}
                                    onChange={handleImageUrlChange}
                                    error={formik.touched.image && Boolean(formik.errors.image)}
                                    helperText={formik.touched.image && formik.errors.image || "Leave empty to auto-generate a placeholder image"}
                                    sx={{
                                        '& .MuiInputBase-root': {
                                            borderRadius: 2
                                        }
                                    }}
                                />
                                <Button
                                    variant="outlined"
                                    onClick={() => {
                                        if (formik.values.name) {
                                            const fallbackUrl = generateFallbackImage(formik.values.name);
                                            formik.setFieldValue("image", fallbackUrl);
                                            setImagePreview(fallbackUrl);
                                        }
                                    }}
                                    disabled={!formik.values.name}
                                    sx={{
                                        minWidth: 140,
                                        height: 56,
                                        borderRadius: 2
                                    }}
                                >
                                    Generate Random
                                </Button>
                            </Box>
                        </Box>

                        {/* Form Fields in Grid Layout */}
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    name="name"
                                    label="Product Name"
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    error={formik.touched.name && Boolean(formik.errors.name)}
                                    helperText={formik.touched.name && formik.errors.name}
                                    sx={{
                                        '& .MuiInputBase-root': { borderRadius: 2 },
                                        '& .MuiFormLabel-root': { fontWeight: 'bold' }
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    name="price"
                                    label="Price ($)"
                                    type="number"
                                    value={formik.values.price}
                                    onChange={formik.handleChange}
                                    error={formik.touched.price && Boolean(formik.errors.price)}
                                    helperText={formik.touched.price && formik.errors.price}
                                    sx={{
                                        '& .MuiInputBase-root': { borderRadius: 2 },
                                        '& .MuiFormLabel-root': { fontWeight: 'bold' }
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    name="countInStock"
                                    label="Stock Count"
                                    type="number"
                                    value={formik.values.countInStock}
                                    onChange={formik.handleChange}
                                    error={formik.touched.countInStock && Boolean(formik.errors.countInStock)}
                                    helperText={formik.touched.countInStock && formik.errors.countInStock}
                                    sx={{
                                        '& .MuiInputBase-root': { borderRadius: 2 },
                                        '& .MuiFormLabel-root': { fontWeight: 'bold' }
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    name="category"
                                    label="Category"
                                    value={formik.values.category}
                                    onChange={formik.handleChange}
                                    error={formik.touched.category && Boolean(formik.errors.category)}
                                    helperText={formik.touched.category && formik.errors.category}
                                    sx={{
                                        '& .MuiInputBase-root': { borderRadius: 2 },
                                        '& .MuiFormLabel-root': { fontWeight: 'bold' }
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    name="brand"
                                    label="Brand"
                                    value={formik.values.brand}
                                    onChange={formik.handleChange}
                                    error={formik.touched.brand && Boolean(formik.errors.brand)}
                                    helperText={formik.touched.brand && formik.errors.brand}
                                    sx={{
                                        '& .MuiInputBase-root': { borderRadius: 2 },
                                        '& .MuiFormLabel-root': { fontWeight: 'bold' }
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    name="description"
                                    label="Description"
                                    multiline
                                    rows={4}
                                    value={formik.values.description}
                                    onChange={formik.handleChange}
                                    error={formik.touched.description && Boolean(formik.errors.description)}
                                    helperText={formik.touched.description && formik.errors.description}
                                    sx={{
                                        '& .MuiInputBase-root': { borderRadius: 2 },
                                        '& .MuiFormLabel-root': { fontWeight: 'bold' }
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions sx={{ p: 3, gap: 1 }}>
                        <Button
                            onClick={() => setOpenDialog(false)}
                            variant="outlined"
                            sx={{ borderRadius: 2, minWidth: 100 }}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            color="success"
                            disabled={isLoading}
                            sx={{ borderRadius: 2, minWidth: 120, fontWeight: 'bold' }}
                        >
                            {isLoading ? (
                                <CircularProgress size={20} color="inherit" />
                            ) : (
                                editingProduct ? "Update Product" : "Add Product"
                            )}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            <ConfirmModal
                open={openDeleteModal}
                onClose={() => setOpenDeleteModal(false)}
                onConfirm={confirmDeleteProduct}
                message={CONFIRMATIONMESSAGE.PRODUCT_DELETE}
            />
        </Box>
    );
};

export default SellerProductsLayout;
