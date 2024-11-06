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
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { AppState, Product } from "@common/interface";
import LoadingOverlay from "src/components/loaders/TextLoader";
import { LOADERTEXT } from "@common/constants";

const ProductManagementLayout: React.FC = () => {
	const { loading } = useSelector((state: { app: AppState }) => state.app);
	const { products } = useSelector(({ productLists }: any) => productLists);
	const [currentPage, setCurrentPage] = useState(1);
	const [productsPerPage] = useState(6);
	const router = useRouter();

	const indexOfLastProduct = currentPage * productsPerPage;
	const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

	const sortedProducts = [...products].sort((a: Product, b: Product) =>
		a.name.localeCompare(b.name),
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

	const handleAddNewProduct = () => {
		router.push("/admin/products/add");
	};

	const truncateText = (text: string, maxLength: number) =>
		text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;

	if (loading) {
		return (
			<LoadingOverlay variant="overlay" loadingMessage={LOADERTEXT.DEFAULT} />
		);
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
					Add New Product
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
										sx={{ mb: 2 }}
									/>
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
												fontSize: "0.85rem",
											}}
											onClick={() => handleEditProduct(product._id)}
										>
											Edit
										</Button>
										<IconButton color="error">
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
		</Box>
	);
};

export default ProductManagementLayout;
