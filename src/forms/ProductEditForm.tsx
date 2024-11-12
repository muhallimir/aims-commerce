import React, { useEffect, useState } from "react";
import {
	Box,
	Button,
	Container,
	TextField,
	Typography,
	IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useFormik } from "formik";
import * as yup from "yup";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "@common/interface";
import {
	setCurrentProduct,
	useGetProductMutation,
	useUpdateProductMutation,
	useUploadProductImageMutation,
} from "@store/products.slice";
import LoadingOverlay from "src/components/loaders/TextLoader";
import { LOADERTEXT, SUCCESSMESSAGE } from "@common/constants";
import SuccessModal from "src/components/modals/SuccessModal";

const ProductEditForm: React.FC = () => {
	const router = useRouter();
	const dispatch = useDispatch();
	const { loading } = useSelector((state: { app: AppState }) => state.app);
	const { currentProduct } = useSelector((state: any) => state.productLists);
	const [reqGetProduct] = useGetProductMutation();
	const [reqUpdateProduct] = useUpdateProductMutation();
	const [reqUploadProductImage] = useUploadProductImageMutation();
	const [openSuccessModal, setOpenSuccessModal] = useState(false);
	const productId = router?.query?._id;

	useEffect(() => {
		if (productId) {
			reqGetProduct({ productId });
		}
	}, [productId, reqGetProduct]);

	const formik = useFormik({
		initialValues: {
			name: currentProduct?.name || "",
			price: currentProduct?.price || 0,
			image: currentProduct?.image || "",
			category: currentProduct?.category || "",
			brand: currentProduct?.brand || "",
			countInStock: currentProduct?.countInStock || 0,
			description: currentProduct?.description || "",
		},
		validationSchema: yup.object({
			name: yup.string().required("Product name is required"),
			price: yup
				.number()
				.required("Price is required")
				.positive("Price must be positive"),
			image: yup.string().required("Image URL is required"),
			category: yup.string().required("Category is required"),
			brand: yup.string().required("Brand is required"),
			countInStock: yup
				.number()
				.required("Number of stocks is required")
				.min(0, "Must be at least 0"),
			description: yup.string().required("Description is required"),
		}),
		onSubmit: (values) => {
			const payload = {
				_id: productId,
				...values,
				price: String(values.price),
			};
			reqUpdateProduct({ productId, ...payload })
				.unwrap()
				.then(() => {
					reqGetProduct({ productId });
					setOpenSuccessModal(true);
				});
		},
		enableReinitialize: true,
	});

	const handleRouteBack = () => {
		dispatch(setCurrentProduct(null));
		router.back();
	};

	const handleImageUpload = async (e: any) => {
		const file = e.target.files[0];
		await reqUploadProductImage(file)
			.unwrap()
			.then((imageUrl) => {
				formik.setFieldValue("image", imageUrl);
			});
	};

	const renderTextField = (
		name: keyof typeof formik.values,
		label: string,
		type = "text",
	) => (
		<TextField
			fullWidth
			margin="normal"
			label={label}
			name={name}
			type={type}
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

	if (loading) {
		return <LoadingOverlay loadingMessage={LOADERTEXT.DEFAULT} />;
	}

	return (
		<Container maxWidth="sm" sx={{ pb: "50px" }}>
			<Box
				component="form"
				onSubmit={formik.handleSubmit}
				sx={{
					mt: 4,
					p: 4,
					boxShadow: 5,
					borderRadius: 3,
					backgroundColor: "background.paper",
					overflow: "hidden",
				}}
			>
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
						Edit Product
					</Typography>
				</Box>

				{renderTextField("name", "Product Name")}
				{renderTextField("price", "Price", "number")}
				<Box display="flex" alignItems="center" mt={2}>
					{renderTextField("image", "Image URL")}
					<Button
						variant="contained"
						color="primary"
						component="label"
						sx={{
							ml: 2,
							height: "100%",
							fontWeight: "bold",
							borderRadius: 2,
							padding: "8px 16px",
							boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
							"&:hover": {
								backgroundColor: "primary.dark",
							},
						}}
					>
						<Typography variant="body2">Upload Image</Typography>
						<input type="file" hidden onChange={handleImageUpload} />
					</Button>
				</Box>

				{renderTextField("category", "Category")}
				{renderTextField("brand", "Brand")}
				{renderTextField("countInStock", "Number of Stocks", "number")}
				{renderTextField("description", "Description")}

				<Button
					type="submit"
					variant="contained"
					color="success"
					sx={{
						width: "100%",
						fontSize: "1rem",
						fontWeight: "bold",
						padding: "8px 16px",
						borderRadius: 2,
						mt: "12px",
						"&:hover": {
							backgroundColor: "success.dark",
						},
					}}
				>
					Update
				</Button>
			</Box>
			<SuccessModal
				open={openSuccessModal}
				onClose={() => setOpenSuccessModal(false)}
				title={SUCCESSMESSAGE.PRODUCT_UPDATE.TITLE}
				subTitle={SUCCESSMESSAGE.PRODUCT_UPDATE.SUBTITLE}
			/>
		</Container>
	);
};

export default ProductEditForm;
