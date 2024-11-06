import React, { useState } from "react";
import { useSelector } from "react-redux";
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
} from "@mui/material";
import { Product } from "@common/interface";

const ProductDetailSection: React.FC = ({}) => {
	const { currentProduct: product } = useSelector(
		(state: any) => state.productLists,
	) as { currentProduct: Product };

	const [open, setOpen] = useState<boolean>(false);
	const { xs } = useScreenSize();

	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	return (
		<Box
			sx={{
				padding: { xs: "10px", sm: "20px" },
				maxWidth: "1200px",
				minWidth: { sm: "600px", md: "900px", lg: "1160px" },
				margin: "auto",
			}}
		>
			<Box
				sx={{
					display: "flex",
					flexDirection: { xs: "column", md: "row" },
					gap: "20px",
					alignItems: "center",
					border: "1px solid var(--background-dark)",
					borderRadius: "10px",
					padding: "20px",
					backgroundColor: "var(--background-light)",
				}}
			>
				<Box
					sx={{
						flex: 1,
						position: "relative",
						display: "flex",
						alignItems: "center",
						height: "100%",
						width: "100%",
						justifyContent: "center",
					}}
				>
					<CardMedia
						component="img"
						image={product?.image}
						alt={product?.name}
						sx={{
							height: { xs: "250px", md: "400px" },
							width: "auto",
							objectFit: "contain",
							borderRadius: "10px",
							boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
							cursor: "zoom-in",
						}}
						onClick={handleOpen}
					/>
					{!xs && (
						<IconButton
							onClick={handleOpen}
							sx={{
								position: "absolute",
								top: "10px",
								right: "10px",
								backgroundColor: "rgba(255, 255, 255, 0.8)",
								"&:hover": { backgroundColor: "rgba(255, 255, 255, 1)" },
							}}
						>
							<ZoomInIcon />
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
								backgroundColor: "rgba(0, 0, 0, 0.8)",
								position: "relative",
								padding: "20px",
							}}
						>
							<CardMedia
								component="img"
								image={product?.image}
								alt={product?.name}
								sx={{
									maxHeight: "80vh",
									width: "auto",
									objectFit: "contain",
									borderRadius: "10px",
									boxShadow: "0 4px 8px rgba(255, 255, 255, 0.2)",
								}}
							/>
							<IconButton
								onClick={handleClose}
								sx={{
									position: "absolute",
									top: "20px",
									right: "20px",
									color: "white",
									backgroundColor: "rgba(0, 0, 0, 0.6)",
									"&:hover": { backgroundColor: "rgba(0, 0, 0, 0.8)" },
								}}
							>
								<CloseIcon />
							</IconButton>
						</Box>
					</Modal>
				)}

				<Box sx={{ flex: 2 }}>
					<Typography
						variant="h4"
						color="primary"
						gutterBottom
						sx={{ fontWeight: "bold" }}
					>
						{product?.name}
					</Typography>
					<Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
						{product?.category} • {product?.brand}
					</Typography>
					<Typography
						variant="h5"
						color="var(--color-text-accent)"
						sx={{ my: 2, fontWeight: "500" }}
					>
						${product?.price?.toFixed(2)}
					</Typography>
					<Stack
						direction="row"
						spacing={1}
						alignItems="center"
						justifyContent="center"
					>
						<Rating value={product?.rating} readOnly precision={0.5} />
						<Typography variant="body2" color="textSecondary">
							({product?.numReviews} reviews)
						</Typography>
					</Stack>

					<Typography
						variant="body1"
						sx={{
							mt: 2,
							lineHeight: 1.6,
							color: "var(--color-text-secondary)",
						}}
					>
						{product?.description}
					</Typography>

					<Stack direction="row" spacing={2} sx={{ mt: 4 }}>
						<Button
							variant="contained"
							color="primary"
							size="large"
							sx={{ flex: 1 }}
						>
							Add to Cart
						</Button>
						<Button
							variant="outlined"
							color="secondary"
							size="large"
							sx={{ flex: 1 }}
						>
							Buy Now
						</Button>
					</Stack>
				</Box>
			</Box>
		</Box>
	);
};

export default ProductDetailSection;
