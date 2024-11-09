import {
	Box,
	Button,
	Chip,
	Divider,
	Card,
	CardContent,
	Typography,
	Pagination,
	IconButton,
	Grid,
} from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { AppState, Product } from "@common/interface";
import { CONFIRMATIONMESSAGE } from "@common/constants";
import {
	setCurrentProduct,
	useCreateNewProductMutation,
	useDeleteProductMutation,
	useGetProductListMutation,
} from "@store/products.slice";
import ConfirmModal from "src/components/modals/ConfirmModal";
import ProductManagementSkeleton from "src/components/loaders/ProductManagmentSkeleton";

const ProductManagementLayout: React.FC = () => {
	const { loading } = useSelector((state: { app: AppState }) => state.app);
	const { products } = useSelector(({ productLists }: any) => productLists);
	const [currentPage, setCurrentPage] = useState(1);
	const [productsPerPage] = useState(6);
	const [reqProductList] = useGetProductListMutation() as unknown as [
		() => Promise<void>,
	];
	const [reqGenerateNewProduct] = useCreateNewProductMutation();
	const [reqDeleteProduct] = useDeleteProductMutation();
	const router = useRouter();
	const dispatch = useDispatch();

	const [openDeleteModal, setOpenDeleteModal] = useState(false);
	const [selectedProductId, setSelectedProductId] = useState<string>("");

	const indexOfLastProduct = currentPage * productsPerPage;
	const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

	const sortedProducts = [...products].sort(
		(a: Product, b: Product) =>
			new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
	);

	const currentProducts = sortedProducts.slice(
		indexOfFirstProduct,
		indexOfLastProduct,
	);

	const handlePageChange = (
		event: React.ChangeEvent<unknown>,
		value: number,
	) => {
		setCurrentPage(value);
	};

	const handleEditProduct = (productId: string) => {
		router.push(`/admin/products/edit/${productId}`);
	};

	const handleViewProduct = (productId: string) => {
		const currentProduct = products.find((p: Product) => p?._id === productId);
		dispatch(setCurrentProduct(currentProduct));
		router.push(`/store/product/${productId}`);
	};

	const handleAddNewProduct = () => {
		reqGenerateNewProduct({})
			.unwrap()
			.then((data) => {
				handleEditProduct(data?.product?._id);
			});
	};

	useEffect(() => {
		reqProductList();
	}, []);

	const truncateText = (text: string, maxLength: number) =>
		text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;

	const formatDate = (date: string) => {
		const options: Intl.DateTimeFormatOptions = {
			year: "numeric",
			month: "short",
			day: "numeric",
			hour: "numeric",
			minute: "numeric",
			second: "numeric",
		};
		return new Date(date).toLocaleDateString(undefined, options);
	};

	const handleDeleteProduct = (productId: string) => {
		setSelectedProductId(productId);
		setOpenDeleteModal(true);
	};

	const confirmDeleteProduct = () => {
		reqDeleteProduct({ productId: selectedProductId })
			.unwrap()
			.then(() => {
				reqProductList();
				setOpenDeleteModal(false);
			});
	};

	const cancelDeleteProduct = () => {
		setOpenDeleteModal(false);
	};

	if (loading) {
		return <ProductManagementSkeleton />;
	}

	return (
		<Box sx={{ maxWidth: 1000, mx: "auto", p: 2 }}>
			<Typography variant="h4" gutterBottom color="primary">
				Product Management
			</Typography>
			<Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
				<Button
					variant="contained"
					startIcon={<Add />}
					sx={{
						bgcolor: "primary.main",
						color: "white",
						fontWeight: "bold",
						"&:hover": { bgcolor: "primary.dark" },
					}}
					onClick={handleAddNewProduct}
				>
					Generate New Product
				</Button>
			</Box>
			{currentProducts.length > 0 ? (
				<Grid container spacing={2}>
					{currentProducts.map((product: Product) => (
						<Grid item xs={12} sm={6} md={4} key={product._id}>
							<Card sx={{ borderRadius: 2, boxShadow: 2, height: "100%" }}>
								<CardContent>
									<Typography variant="h6" noWrap>
										{truncateText(product.name, 15)}
									</Typography>
									<Typography
										variant="body2"
										color="textSecondary"
										gutterBottom
									>
										Price: ${product.price.toFixed(2)}
									</Typography>
									<Chip
										label={
											product.countInStock
												? `In Stock (${product.countInStock})`
												: "Out of Stock"
										}
										color={product.countInStock ? "success" : "error"}
									/>
									<Divider sx={{ my: 2 }} />
									<Box sx={{ mb: 0 }}>
										<Typography
											variant="body2"
											color="textSecondary"
											sx={{
												fontWeight: "bold",
												fontSize: { xs: "0.75rem", sm: "0.85rem" },
												display: "block",
											}}
										>
											Created Date:
										</Typography>
										<Typography
											variant="body2"
											color="textSecondary"
											sx={{
												fontSize: { xs: "0.65rem", sm: "0.75rem" },
												overflowWrap: "break-word",
												lineHeight: 1.4,
											}}
										>
											{formatDate(product.createdAt)}
										</Typography>
									</Box>
									<Box sx={{ mb: 2 }}>
										<Typography
											variant="body2"
											color="textSecondary"
											sx={{
												fontWeight: "bold",
												fontSize: { xs: "0.75rem", sm: "0.85rem" },
												display: "block",
											}}
										>
											Last update:
										</Typography>
										<Typography
											variant="body2"
											color="textSecondary"
											sx={{
												fontSize: { xs: "0.65rem", sm: "0.75rem" },
												overflowWrap: "break-word",
												lineHeight: 1.4,
											}}
										>
											{formatDate(product.updatedAt)}
										</Typography>
									</Box>
									<Divider sx={{ my: 2 }} />
									<Box
										sx={{
											display: "flex",
											justifyContent: "center",
											gap: 1,
										}}
									>
										<Button
											variant="contained"
											startIcon={<Edit />}
											sx={{
												bgcolor: "primary.main",
												color: "white",
												fontSize: "0.75rem",
											}}
											onClick={() => handleEditProduct(product._id)}
										>
											Edit
										</Button>
										<Button
											variant="contained"
											sx={{
												bgcolor: "secondary.main",
												color: "white",
												fontSize: "0.75rem",
											}}
											onClick={() => handleViewProduct(product._id)}
										>
											View
										</Button>
										<IconButton
											color="error"
											onClick={() => handleDeleteProduct(product._id)}
										>
											<Delete />
										</IconButton>
									</Box>
								</CardContent>
							</Card>
						</Grid>
					))}
				</Grid>
			) : (
				<Box textAlign="center">
					<Typography variant="body1" color="textSecondary" align="center">
						No products available.
					</Typography>
				</Box>
			)}
			{currentProducts.length > 0 && (
				<>
					<Divider sx={{ my: 2 }} />
					<Pagination
						count={Math.ceil(products.length / productsPerPage)}
						page={currentPage}
						onChange={handlePageChange}
						variant="outlined"
						color="primary"
						sx={{ display: "flex", justifyContent: "center", my: 2 }}
					/>
				</>
			)}
			<ConfirmModal
				open={openDeleteModal}
				onClose={cancelDeleteProduct}
				onConfirm={confirmDeleteProduct}
				message={CONFIRMATIONMESSAGE.PRODUCT_DELETE}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			/>
		</Box>
	);
};

export default ProductManagementLayout;
