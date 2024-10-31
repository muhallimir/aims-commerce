import React, { useState, useEffect } from "react";
import {
	Grid,
	Container,
	Typography,
	Box,
	useTheme,
	// CircularProgress,
} from "@mui/material";
import ProductCard from "src/components/cards/ProductCard";
import { useSelector } from "react-redux";
import ProductCardSkeleton from "src/components/loaders/ProductCardSkeleton";
import useScreenSize from "src/hooks/useScreenSize";
import { keyframes } from "@emotion/react";

const LoadingOverlay = () => {
	const theme = useTheme();
	const bounce = keyframes`0%, 100% { transform: translateY(0); }  50% { transform: translateY(-10px); }`;
	const gradientShift = keyframes`0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; }`;

	return (
		<Box
			sx={{
				position: "fixed",
				top: 0,
				left: 0,
				width: "100vw",
				height: "100vh",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				zIndex: 9999,
			}}
		>
			<Typography
				variant="h6"
				sx={{
					textAlign: "center",
					mx: 2,
					background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main}, ${theme.palette.primary.light})`,
					backgroundSize: "200% 200%",
					backgroundClip: "text",
					WebkitBackgroundClip: "text",
					color: "transparent",
					fontSize: "1.2rem",
					fontWeight: "medium",
					mb: 2,
					animation: `${gradientShift} 4s ease infinite`, // Same gradient animation
				}}
			>
				Initial loading may take up to 30 seconds due to limitations of
				free-tier hosting. Thank you for your patience.
			</Typography>
			<Box sx={{ display: "flex", gap: "5px" }}>
				{Array.from({ length: 3 }).map((_, i) => (
					<Box
						key={i}
						sx={{
							width: 8,
							height: 8,
							borderRadius: "50%",
							backgroundColor: theme.palette.secondary.main,
							animation: `${bounce} 0.6s ${i * 0.1}s infinite ease-in-out`,
						}}
					/>
				))}
			</Box>
		</Box>
	);
};

const ProductsGridLayout = () => {
	const { theme: mode, loading } = useSelector(({ app }) => app);
	const { products } = useSelector(({ productLists }) => productLists);
	const { xs } = useScreenSize();
	const [showOverlay, setShowOverlay] = useState(false);
	const [loadingStartTime, setLoadingStartTime] = useState(null);

	useEffect(() => {
		if (loading) {
			setLoadingStartTime(Date.now()); // Start timing when loading begins
		} else if (loadingStartTime) {
			const loadingDuration = Date.now() - loadingStartTime;
			if (loadingDuration > 1) setShowOverlay(false); // Remove overlay if loading completes
			setLoadingStartTime(null); // Reset the loading start time
		}
	}, [loading]);

	useEffect(() => {
		let overlayTimeout;
		if (loading && loadingStartTime) {
			overlayTimeout = setTimeout(() => {
				setShowOverlay(true);
			}, 2000);
		}

		return () => clearTimeout(overlayTimeout); // Cleanup timeout on unmount or when loading ends
	}, [loading, loadingStartTime]);

	return (
		<Container
			sx={{ py: 4, width: "100vw", minHeight: "100vh", position: "relative" }}
		>
			{showOverlay && <LoadingOverlay />}
			<Grid container spacing={3} justifyContent="center">
				{loading
					? Array.from(new Array(15)).map((_, index) => (
							<Grid
								item
								xs={12}
								sm={5}
								md={4}
								lg={3}
								key={index}
								sx={{
									display: "flex",
									justifyContent: "center",
								}}
							>
								<ProductCardSkeleton
									darkMode={mode === "dark"}
									theme={mode}
									isMobile={xs}
								/>
							</Grid>
					  ))
					: products.map((product) => (
							<Grid
								item
								xs={12}
								sm={5}
								md={4}
								lg={3}
								key={product._id}
								sx={{
									display: "flex",
									justifyContent: "center",
									transition: "transform 0.3s ease",
								}}
							>
								<ProductCard product={product} />
							</Grid>
					  ))}
			</Grid>
		</Container>
	);
};

export default ProductsGridLayout;
