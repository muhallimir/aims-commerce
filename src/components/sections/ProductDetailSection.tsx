import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import CloseIcon from "@mui/icons-material/Close";
import useScreenSize from "src/hooks/useScreenSize";
import {
	Box,
	Rating,
	Typography,
	Button,
	Stack,
	IconButton,
	Modal,
	CardMedia,
	Skeleton,
} from "@mui/material";
import { AppState, ProductListState } from "@common/interface";
import { updateCartList } from "@store/cart.slice";
import useCartHandling from "src/hooks/useCartHandling";
import { getImageUrl } from "@helpers/commonFn";

const ProductDetailSection: React.FC = ({ }) => {
	const { currentProduct: product } = useSelector(
		(state: { productLists: ProductListState }) => state.productLists,
	);
	const { loading } = useSelector((state: { app: AppState }) => state.app);
	const dispatch = useDispatch();
	const [open, setOpen] = useState<boolean>(false);
	const { xs } = useScreenSize();
	const { viewCartPage } = useCartHandling();

	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	const handleAddToCart = () => {
		dispatch(updateCartList(product));
	};

	return (
		<Box
			sx={{
				background: "white",
				borderRadius: 2,
				boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
				overflow: "hidden",
			}}
		>
			<Box
				sx={{
					display: "flex",
					flexDirection: { xs: "column", md: "row" },
					gap: { xs: 0, md: 4 },
				}}
			>
				{/* Image Section */}
				<Box
					sx={{
						flex: { md: "0 0 400px" },
						height: { xs: "300px", sm: "400px", md: "500px" },
						position: "relative",
						background: "white",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						p: { xs: 2, md: 3 },
					}}
				>
					{loading ? (
						<Skeleton
							variant="rectangular"
							sx={{
								borderRadius: 2,
								height: "100%",
								width: "100%",
								bgcolor: "rgba(0, 0, 0, 0.04)",
							}}
						/>
					) : (
						<CardMedia
							component="img"
							image={getImageUrl(product?.image)}
							alt={product?.name}
							sx={{
								height: "100%",
								width: "100%",
								objectFit: "contain",
								cursor: "zoom-in",
								transition: "transform 0.3s ease",
								"&:hover": {
									transform: "scale(1.05)",
								},
							}}
							onClick={handleOpen}
						/>
					)}
					{!xs && !loading && (
						<IconButton
							onClick={handleOpen}
							sx={{
								position: "absolute",
								top: 16,
								right: 16,
								background: "rgba(255, 255, 255, 0.9)",
								boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
								width: 40,
								height: 40,
								"&:hover": {
									background: "white",
									transform: "scale(1.1)",
								},
							}}
						>
							<ZoomInIcon sx={{ color: "text.secondary", fontSize: 20 }} />
						</IconButton>
					)}
				</Box>

				{!xs && (
					<Modal open={open} onClose={handleClose}>
						<Box
							sx={{
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								height: "100vh",
								background: "rgba(0, 0, 0, 0.9)",
								backdropFilter: "blur(20px)",
								position: "relative",
								padding: "20px",
							}}
						>
							<CardMedia
								component="img"
								image={getImageUrl(product?.image)}
								alt={product?.name}
								sx={{
									maxHeight: "85vh",
									maxWidth: "85vw",
									width: "auto",
									height: "auto",
									objectFit: "contain",
									borderRadius: 3,
									boxShadow: "0 32px 64px rgba(0, 0, 0, 0.5)",
									animation: "modalZoom 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
									"@keyframes modalZoom": {
										from: { opacity: 0, transform: "scale(0.8)" },
										to: { opacity: 1, transform: "scale(1)" },
									},
								}}
							/>
							<IconButton
								onClick={handleClose}
								sx={{
									position: "absolute",
									top: 32,
									right: 32,
									color: "white",
									background: "rgba(0, 0, 0, 0.7)",
									backdropFilter: "blur(10px)",
									width: 56,
									height: 56,
									transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
									"&:hover": {
										background: "rgba(0, 0, 0, 0.9)",
										transform: "scale(1.1)",
									},
								}}
							>
								<CloseIcon fontSize="large" />
							</IconButton>
						</Box>
					</Modal>
				)}

				{/* Product Info Section */}
				<Box
					sx={{
						flex: 1,
						p: { xs: 3, md: 4 },
					}}
				>
					{loading ? (
						<Skeleton variant="text" width="80%" height={40} sx={{ mb: 2 }} />
					) : (
						<Typography
							variant="h4"
							sx={{
								fontWeight: 700,
								color: "text.primary",
								mb: 1,
								fontSize: { xs: "1.5rem", md: "1.75rem" },
								lineHeight: 1.3,
							}}
						>
							{product?.name}
						</Typography>
					)}

					{loading ? (
						<Skeleton variant="text" width="60%" height={24} sx={{ mb: 2 }} />
					) : (
						<Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
							<Typography
								variant="body2"
								sx={{
									color: "text.secondary",
									fontSize: "0.9rem",
								}}
							>
								{product?.category}
							</Typography>
							<Box
								sx={{
									width: 4,
									height: 4,
									borderRadius: "50%",
									bgcolor: "text.secondary",
									opacity: 0.5,
								}}
							/>
							<Typography
								variant="body2"
								sx={{
									color: "text.secondary",
									fontSize: "0.9rem",
								}}
							>
								{product?.brand}
							</Typography>
						</Box>
					)}

					{loading ? (
						<Skeleton variant="text" width="40%" height={36} sx={{ mb: 2 }} />
					) : (
						<Typography
							variant="h5"
							sx={{
								fontWeight: 700,
								color: "primary.main",
								mb: 2,
								fontSize: { xs: "1.5rem", md: "1.75rem" },
							}}
						>
							${product?.price?.toFixed(2)}
						</Typography>
					)}

					{loading ? (
						<Skeleton variant="rectangular" width="50%" height={32} sx={{ mb: 2 }} />
					) : (
						<Box
							sx={{
								display: "flex",
								alignItems: "center",
								gap: 1,
								mb: 2,
							}}
						>
							<Rating
								value={product?.rating}
								readOnly
								precision={0.5}
								size="small"
								sx={{
									"& .MuiRating-iconFilled": {
										color: "#ffa726",
									},
								}}
							/>
							<Typography
								variant="body2"
								sx={{
									color: "text.secondary",
									ml: 0.5,
								}}
							>
								({product?.numReviews} reviews)
							</Typography>
						</Box>
					)}

					{loading ? (
						<Skeleton variant="text" width="100%" height={60} sx={{ mb: 3 }} />
					) : (
						<Typography
							variant="body1"
							sx={{
								lineHeight: 1.6,
								color: "text.secondary",
								mb: 3,
								fontSize: "0.95rem",
							}}
						>
							{product?.description}
						</Typography>
					)}

					{loading ? (
						<Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
							<Skeleton variant="rectangular" width="100%" height={48} />
							<Skeleton variant="rectangular" width="100%" height={48} />
						</Stack>
					) : (
						<Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
							{product?.countInStock === 0 ? (
								<Button
									variant="contained"
									size="large"
									disabled
									sx={{
										flex: 1,
										py: 1.5,
										fontSize: "1rem",
										fontWeight: 600,
										borderRadius: 2,
										textTransform: "none",
										background: "rgba(244, 67, 54, 0.1)",
										color: "#d32f2f",
										border: "1px solid rgba(244, 67, 54, 0.3)",
										"&.Mui-disabled": {
											opacity: 1,
											color: "#d32f2f",
										},
									}}
								>
									Out of Stock
								</Button>
							) : (
								<Button
									variant="contained"
									size="large"
									onClick={handleAddToCart}
									sx={{
										flex: 1,
										py: 1.5,
										fontSize: "1rem",
										fontWeight: 600,
										borderRadius: 2,
										textTransform: "none",
										background: "primary.main",
										color: "white",
										boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
										"&:hover": {
											background: "primary.dark",
											boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
										},
									}}
								>
									Add to Cart
								</Button>
							)}
							<Button
								variant="outlined"
								size="large"
								onClick={viewCartPage}
								sx={{
									flex: 1,
									py: 1.5,
									fontSize: "1rem",
									fontWeight: 600,
									borderRadius: 2,
									textTransform: "none",
									borderColor: "rgba(0, 0, 0, 0.15)",
									color: "text.primary",
									"&:hover": {
										borderColor: "primary.main",
										background: "rgba(0, 0, 0, 0.02)",
									},
								}}
							>
								View Cart
							</Button>
						</Stack>
					)}
				</Box>
			</Box>
		</Box>
	);
};

export default ProductDetailSection;
