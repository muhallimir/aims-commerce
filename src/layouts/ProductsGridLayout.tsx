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
import { FlashSaleBar } from "src/components/FlashSaleBar";
import { CategoryChips } from "src/components/CategoryChips";
import { SortSelect, type SortKey } from "src/components/SortSelect";
import { CompareTray, CompareCheckbox, type TrayItem } from "src/components/CompareTray";
import { TopRatedSpotlight } from "src/components/TopRatedSpotlight";
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
	const [category, setCategory] = useState<string>("All");
	const [sort, setSort] = useState<SortKey>("featured");
	const [compare, setCompare] = useState<TrayItem[]>([]);
	const dispatch = useDispatch();

	function toggleCompare(p: TrayItem) {
		setCompare((c) => (c.some((x) => x.id === p.id) ? c.filter((x) => x.id !== p.id) : [...c, p].slice(-3)));
	}

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


	const categories: string[] = ["All"];
	for (const p of products as any[]) {
		if (p?.category && !categories.includes(p.category)) categories.push(p.category);
	}

	const priceOf = (p: any) => Number(p.price ?? p.sellingPrice ?? 0);

	const filteredProducts = products
		.filter((product: any) => product.isActive === true)
		.filter((product: any) => category === "All" || product.category === category)
		.filter((product: any) =>
			[product.title, product.name, product.category, product.description]
				.join(" ")
				.toLowerCase()
				.includes(searchQuery.toLowerCase()),
		)
		.slice()
		.sort((a: any, b: any) => {
			if (sort === "price-asc") return priceOf(a) - priceOf(b);
			if (sort === "price-desc") return priceOf(b) - priceOf(a);
			if (sort === "name") return String(a.title ?? a.name ?? "").localeCompare(String(b.title ?? b.name ?? ""));
			return 0;
		});

	return (
		<Container
			sx={{ py: 4, width: "100vw", minHeight: "100vh", position: "relative" }}
		>
			<SearchBar onSearch={handleSearch} value={searchQuery} />
			<FlashSaleBar />
			<TopRatedSpotlight products={products} onOpen={(id) => router.push(`/store/product/${id}`)} />
			<CategoryChips categories={categories} value={category} onChange={setCategory} />
			<SortSelect value={sort} onChange={setSort} />
			{showOverlay && (
				<LoadingOverlay loadingMessage={LOADERTEXT.INITIAL_LOAD} />
			)}
			<Grid container spacing={{ xs: 1, sm: 3 }} justifyContent="center" id="store-grid" data-testid="store-grid">
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
								flexDirection: "column",
								justifyContent: "center",
								transition: "transform 0.3s ease",
							}}
						>
							<ProductCard product={product} />
							<CompareCheckbox
								item={{ id: product._id, name: product.name ?? product.title, price: Number(product.price ?? 0), rating: Number(product.rating ?? 0), inStock: Number(product.countInStock ?? product.count_in_stock ?? 0) > 0, brand: product.brand }}
								checked={compare.some((x) => x.id === product._id)}
								onToggle={toggleCompare}
							/>
						</Grid>
					))}
			</Grid>
			<CompareTray items={compare} onToggle={toggleCompare} onClear={() => setCompare([])} />
		</Container>
	);
};

export default ProductsGridLayout;
