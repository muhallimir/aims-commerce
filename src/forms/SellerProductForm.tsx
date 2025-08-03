import React, { useState, useRef } from "react";
import {
    Box,
    Button,
    Container,
    TextField,
    Typography,
    IconButton,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Card,
    CardContent,
    Paper,
    Alert,
} from "@mui/material";
import {
    ArrowBack as ArrowBackIcon,
    CloudUpload as CloudUploadIcon,
    Image as ImageIcon,
    Delete as DeleteIcon,
} from "@mui/icons-material";
import { useFormik } from "formik";
import * as yup from "yup";
import { useRouter } from "next/router";
import { useCreateSellerProductMutation } from "@store/seller.slice";
import LoadingOverlay from "src/components/loaders/TextLoader";
import { LOADERTEXT, SUCCESSMESSAGE } from "@common/constants";
import SuccessModal from "src/components/modals/SuccessModal";

const SellerProductForm: React.FC = () => {
    const router = useRouter();
    const [reqCreateProduct, { isLoading }] = useCreateSellerProductMutation();
    const [openSuccessModal, setOpenSuccessModal] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [uploadedImage, setUploadedImage] = useState<string>("");
    const [uploadError, setUploadError] = useState<string>("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const formik = useFormik({
        initialValues: {
            name: "",
            price: 0,
            image: "",
            category: "",
            brand: "",
            countInStock: 0,
            description: "",
        },
        validationSchema: yup.object({
            name: yup.string().required("Product name is required"),
            price: yup
                .number()
                .required("Price is required")
                .positive("Price must be positive"),
            image: yup.string().nullable(),
            category: yup.string().required("Category is required"),
            brand: yup.string().required("Brand is required"),
            countInStock: yup
                .number()
                .required("Number of stocks is required")
                .min(0, "Must be at least 0"),
            description: yup.string().required("Description is required"),
        }),
        onSubmit: async (values) => {
            try {
                // Generate fallback image if no image provided
                const productData = {
                    ...values,
                    price: Number(values.price),
                    countInStock: Number(values.countInStock),
                    image: values.image || generateFallbackImage(values.name)
                };

                await reqCreateProduct(productData).unwrap();
                setOpenSuccessModal(true);
            } catch (error) {
                console.error("Error creating product:", error);
            }
        },
    });

    // Image handling functions
    const generateFallbackImage = (productName: string) => {
        const seed = productName.toLowerCase().replace(/\s+/g, "-");
        return `https://picsum.photos/seed/${seed}/800/600`;
    };

    const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const url = e.target.value;
        formik.handleChange(e);
        setUploadedImage(url);
    };

    const handleFileUpload = (file: File) => {
        setUploadError("");

        if (!file.type.startsWith("image/")) {
            setUploadError("Please select a valid image file");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setUploadError("File size must be less than 5MB");
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const base64String = e.target?.result as string;
            setUploadedImage(base64String);
            formik.setFieldValue("image", base64String);
        };
        reader.readAsDataURL(file);
    };

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
                    setUploadedImage(result);
                    formik.setFieldValue('image', result);
                };
                reader.readAsDataURL(file);
            }
        }
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const result = event.target?.result as string;
                    setUploadedImage(result);
                    formik.setFieldValue('image', result);
                };
                reader.readAsDataURL(file);
            }
        }
    };

    const generateRandomImage = () => {
        if (formik.values.name) {
            const fallbackUrl = generateFallbackImage(formik.values.name);
            formik.setFieldValue("image", fallbackUrl);
            setUploadedImage(fallbackUrl);
        }
    };

    const clearImage = () => {
        formik.setFieldValue("image", "");
        setUploadedImage("");
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleRouteBack = () => {
        router.back();
    };

    const handleSuccessClose = () => {
        setOpenSuccessModal(false);
        router.push("/seller/dashboard");
    };

    const renderTextField = (
        name: keyof typeof formik.values,
        label: string,
        type = "text",
        multiline = false,
        rows = 1,
    ) => (
        <TextField
            fullWidth
            margin="normal"
            label={label}
            name={name}
            type={type}
            multiline={multiline}
            rows={rows}
            value={formik.values[name]}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={Boolean(formik.touched[name] && formik.errors[name])}
            helperText={formik.touched[name] && (formik.errors[name] as string)}
            sx={{
                "& .MuiInputBase-root": {
                    borderRadius: 4,
                },
                "& .MuiFormLabel-root": {
                    fontWeight: "bold",
                },
            }}
        />
    );

    if (isLoading) {
        return <LoadingOverlay loadingMessage={LOADERTEXT.ONGOING} />;
    }

    return (
        <Container maxWidth="md" sx={{ pb: "50px" }}>
            <Card sx={{ mt: 4, boxShadow: 5, borderRadius: 3 }}>
                <CardContent sx={{ p: 4 }}>
                    <Box display="flex" alignItems="center" mb={3}>
                        <IconButton onClick={handleRouteBack} sx={{ mr: 2 }}>
                            <ArrowBackIcon sx={{ fontSize: 28, color: "primary.main" }} />
                        </IconButton>
                        <Typography
                            variant="h5"
                            color="text.primary"
                            sx={{
                                fontWeight: "600",
                                flexGrow: 1,
                                textAlign: "center",
                                fontFamily: "Roboto, sans-serif",
                            }}
                        >
                            Add New Product
                        </Typography>
                    </Box>

                    <Box component="form" onSubmit={formik.handleSubmit}>
                        {renderTextField("name", "Product Name")}

                        <Box display="flex" gap={2}>
                            {renderTextField("price", "Price", "number")}
                            {renderTextField("countInStock", "Number of Stocks", "number")}
                        </Box>

                        <Box display="flex" gap={2}>
                            <FormControl fullWidth margin="normal">
                                <InputLabel>Category</InputLabel>
                                <Select
                                    name="category"
                                    value={formik.values.category}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={Boolean(formik.touched.category && formik.errors.category)}
                                    sx={{
                                        borderRadius: 4,
                                    }}
                                >
                                    <MenuItem value="Electronics">Electronics</MenuItem>
                                    <MenuItem value="Clothing">Clothing</MenuItem>
                                    <MenuItem value="Books">Books</MenuItem>
                                    <MenuItem value="Home & Garden">Home & Garden</MenuItem>
                                    <MenuItem value="Sports">Sports</MenuItem>
                                    <MenuItem value="Automotive">Automotive</MenuItem>
                                    <MenuItem value="Health & Beauty">Health & Beauty</MenuItem>
                                    <MenuItem value="Toys & Games">Toys & Games</MenuItem>
                                    <MenuItem value="Other">Other</MenuItem>
                                </Select>
                            </FormControl>

                            {renderTextField("brand", "Brand")}
                        </Box>

                        {/* Image Upload Section */}
                        <Box sx={{ mt: 3, mb: 2 }}>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                                Product Image
                            </Typography>

                            {/* Image Preview */}
                            {(uploadedImage || formik.values.name) && (
                                <Box sx={{ mb: 2, textAlign: 'center' }}>
                                    <Paper elevation={2} sx={{ p: 1, borderRadius: 2, display: 'inline-block' }}>
                                        <img
                                            src={uploadedImage || generateFallbackImage(formik.values.name)}
                                            alt="Preview"
                                            style={{
                                                maxWidth: '200px',
                                                maxHeight: '150px',
                                                objectFit: 'cover',
                                                borderRadius: '8px'
                                            }}
                                        />
                                    </Paper>
                                    {!uploadedImage && formik.values.name && (
                                        <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 1 }}>
                                            Auto-generated placeholder (will be used if no image is provided)
                                        </Typography>
                                    )}
                                    {uploadedImage && (
                                        <Box sx={{ mt: 1 }}>
                                            <IconButton onClick={clearImage} size="small" color="error">
                                                <DeleteIcon />
                                            </IconButton>
                                        </Box>
                                    )}
                                </Box>
                            )}

                            {/* Drag and Drop Area */}
                            <Paper
                                elevation={0}
                                sx={{
                                    border: dragActive ? '2px dashed #1976d2' : '2px dashed #ccc',
                                    borderRadius: 2,
                                    p: 3,
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    bgcolor: dragActive ? 'action.hover' : 'grey.50',
                                    mb: 2,
                                    transition: "all 0.2s ease",
                                    "&:hover": {
                                        borderColor: "primary.main",
                                        bgcolor: "primary.50",
                                    },
                                }}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileInputChange}
                                    style={{ display: 'none' }}
                                />
                                <CloudUploadIcon
                                    sx={{
                                        fontSize: 48,
                                        color: dragActive ? "primary.main" : "grey.400",
                                        mb: 1
                                    }}
                                />
                                <Typography variant="h6" sx={{ mb: 1 }}>
                                    Drag & drop an image here, or click to browse
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Supported formats: JPG, PNG, GIF • Max size: 5MB
                                </Typography>
                            </Paper>

                            {uploadError && (
                                <Alert severity="error" sx={{ mb: 2 }}>
                                    {uploadError}
                                </Alert>
                            )}

                            {/* Image URL Input */}
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
                                    mb: 2,
                                    "& .MuiInputBase-root": {
                                        borderRadius: 4,
                                    },
                                }}
                            />

                            <Button
                                variant="outlined"
                                onClick={generateRandomImage}
                                disabled={!formik.values.name}
                                startIcon={<ImageIcon />}
                            >
                                Generate Random Image
                            </Button>
                        </Box>

                        {renderTextField("description", "Description", "text", true, 4)}

                        <Button
                            type="submit"
                            variant="contained"
                            color="success"
                            size="large"
                            sx={{
                                width: "100%",
                                fontSize: "1.1rem",
                                fontWeight: "bold",
                                padding: "12px 16px",
                                borderRadius: 2,
                                mt: 3,
                                "&:hover": {
                                    backgroundColor: "success.dark",
                                },
                            }}
                        >
                            Add Product
                        </Button>
                    </Box>
                </CardContent>
            </Card>

            <SuccessModal
                open={openSuccessModal}
                onClose={handleSuccessClose}
                title="Product Added Successfully!"
                subTitle="Your product has been added to your store and is now available for customers to purchase."
            />
        </Container>
    );
};

export default SellerProductForm;
