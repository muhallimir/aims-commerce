import React, { useState, useEffect } from "react";
import { Grid, Container, Typography, Box, useTheme } from "@mui/material";
import ProductCard from "src/components/cards/ProductCard";
import { useSelector } from "react-redux";
import useScreenSize from "src/hooks/useScreenSize";
import { keyframes } from "@emotion/react";
import ProductCardSkeleton from "src/components/loaders/ProductCardSkeleton";

const LoadingOverlay: React.FC = () => {
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

const ProductsGridLayout: React.FC = () => {
	const { theme: mode, loading } = useSelector((state: any) => state.app);
	const { products } = useSelector((state: any) => state.productLists);
	const { xs } = useScreenSize();
	const [showOverlay, setShowOverlay] = useState<boolean>(false);
	const [loadingStartTime, setLoadingStartTime] = useState<number | null>(null);

	useEffect(() => {
		if (loading) {
			setLoadingStartTime(Date.now());
		} else if (loadingStartTime) {
			const loadingDuration = Date.now() - loadingStartTime;
			if (loadingDuration > 1) setShowOverlay(false);
			setLoadingStartTime(null);
		}
	}, [loading]);

	useEffect(() => {
		let overlayTimeout: NodeJS.Timeout;
		if (loading && loadingStartTime) {
			overlayTimeout = setTimeout(() => {
				setShowOverlay(true);
			}, 2000);
		}

		return () => clearTimeout(overlayTimeout);
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
								<ProductCardSkeleton darkMode={mode === "dark"} isMobile={xs} />
							</Grid>
					  ))
					: products.map((product: any) => (
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
