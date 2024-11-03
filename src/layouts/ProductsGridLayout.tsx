import React, { useState, useEffect } from "react";
import { Grid, Container } from "@mui/material";
import ProductCard from "src/components/cards/ProductCard";
import { useDispatch, useSelector } from "react-redux";
import useScreenSize from "src/hooks/useScreenSize";
import ProductCardSkeleton from "src/components/loaders/ProductCardSkeleton";
import LoadingOverlay from "src/components/loaders/TextLoader";
import { LOADERTEXT } from "@common/constants";
import { setFromPurchaseHistory } from "@store/order.slice";

const ProductsGridLayout: React.FC = () => {
	const { theme: mode, loading } = useSelector((state: any) => state.app);
	const { products } = useSelector((state: any) => state.productLists);
	const { xs } = useScreenSize();
	const [showOverlay, setShowOverlay] = useState<boolean>(false);
	const [loadingStartTime, setLoadingStartTime] = useState<number | null>(null);
	const dispatch = useDispatch();
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

	useEffect(() => {
		dispatch(setFromPurchaseHistory(false));
	}, []);

	return (
		<Container
			sx={{ py: 4, width: "100vw", minHeight: "100vh", position: "relative" }}
		>
			{showOverlay && (
				<LoadingOverlay
					variant="transparent"
					loadingMessage={LOADERTEXT.INITIAL_LOAD}
				/>
			)}
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
