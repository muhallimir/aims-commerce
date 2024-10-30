import React from "react";
import { Grid, Container, Skeleton } from "@mui/material"; // Import Skeleton from MUI
import ProductCard from "src/components/cards/ProductCard";
import { useSelector } from "react-redux";
import ProductCardSkeleton from "src/components/loaders/ProductCardSkeleton";
import useScreenSize from "src/hooks/useScreenSize";

const ProductsGridLayout = () => {
	const { theme: mode, loading } = useSelector(({ app }) => app);
	const { products } = useSelector(({ productLists }) => productLists);
	const { xs } = useScreenSize();

	return (
		<Container sx={{ py: 4, width: "100vw", minHeight: "100vh" }}>
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
								{
									<ProductCardSkeleton
										darkMode={mode === "dark"}
										theme={mode}
										isMobile={xs}
									/>
								}
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
