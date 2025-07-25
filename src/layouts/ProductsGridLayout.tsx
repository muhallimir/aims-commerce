import React, { useState, useEffect } from "react";
import { Grid, Container } from "@mui/material";
import ProductCard from "src/components/cards/ProductCard";
import { useDispatch, useSelector } from "react-redux";
import useScreenSize from "src/hooks/useScreenSize";
import ProductCardSkeleton from "src/components/loaders/ProductCardSkeleton";
import LoadingOverlay from "src/components/loaders/TextLoader";
import { LOADERTEXT } from "@common/constants";
import { setFromPurchaseHistory } from "@store/order.slice";
import SearchBar from "src/components/bars/SearchBar";
import { useGetProductListMutation } from "@store/products.slice";
import { useRouter } from "next/router";

const ProductsGridLayout: React.FC = () => {
	const { theme: mode, loading } = useSelector((state: any) => state.app);
	const { products } = useSelector((state: any) => state.productLists);
	const { xs } = useScreenSize();
	const [showOverlay, setShowOverlay] = useState<boolean>(false);
	const [loadingStartTime, setLoadingStartTime] = useState<number | null>(null);
	const [reqProductList] = useGetProductListMutation() as unknown as [
		() => Promise<void>,
	];
	const router = useRouter();
	const initialSearchQuery = (router.query.search as string) || "";
	const [searchQuery, setSearchQuery] = useState<string>(initialSearchQuery || "");
	const dispatch = useDispatch();

	useEffect(() => {
		if (initialSearchQuery) {
			setSearchQuery(initialSearchQuery);
		}
	}, [initialSearchQuery]);

	useEffect(() => {
		reqProductList();
	}, []);

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

	const handleSearch = (query: string) => {
		setSearchQuery(query);
		const url = {
			pathname: router.pathname,
			query: { ...router.query, search: query || undefined }
		};
		router.push(url, undefined, { shallow: true });
	};


	const filteredProducts = products.filter((product: any) =>
		[product.title, product.category, product.description]
			.join(" ")
			.toLowerCase()
			.includes(searchQuery.toLowerCase()),
	);

	return (
		<Container
			sx={{ py: 4, width: "100vw", minHeight: "100vh", position: "relative" }}
		>
			<SearchBar onSearch={handleSearch} value={searchQuery} />
			{showOverlay && (
				<LoadingOverlay loadingMessage={LOADERTEXT.INITIAL_LOAD} />
			)}
			<Grid container spacing={{ xs: 1, sm: 3 }} justifyContent="center">
				{loading
					? Array.from(new Array(15)).map((_, index) => (
						<Grid
							item
							xs={6}
							sm={5}
							md={4}
							lg={3}
							key={index}
							sx={{ display: "flex", justifyContent: "center" }}
						>
							<ProductCardSkeleton darkMode={mode === "dark"} isMobile={xs} />
						</Grid>
					))
					: filteredProducts.map((product: any) => (
						<Grid
							item
							xs={6}
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
