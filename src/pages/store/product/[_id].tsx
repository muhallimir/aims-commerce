import { useEffect } from "react";
import { useRouter } from "next/router";
import Stack from "@mui/material/Stack";
import { Box } from "@mui/material";
import ProductDetailSection from "src/components/sections/ProductDetailSection";
import ProductReviewSection from "src/components/sections/ProductReviewSection";
import { BreadcrumbTrail } from "src/components/BreadcrumbTrail";
import { useSelector } from "react-redux";
import { useGetProductMutation } from "src/store/products.slice";
import { recordProductView } from "@lib/recentViews";

const Product: React.FC = () => {
	const router = useRouter();
	const [reqGetProduct] = useGetProductMutation();
	const productId = router.query._id as string;
	const currentProduct = useSelector((state: any) => state.productLists?.currentProduct);

	useEffect(() => {
		if (productId) recordProductView(productId);
	}, [productId]);

	useEffect(() => {
		if (productId) {
			reqGetProduct({ productId });
		}
	}, [productId, reqGetProduct]);

	return (
		<Box
			sx={{
				minHeight: "100vh",
				background: "#f8fafc",
				py: { xs: 2, md: 4 },
			}}
		>
			<Stack
				spacing={3}
				sx={{
					maxWidth: "1200px",
					mx: "auto",
					px: { xs: 2, sm: 3, md: 4 },
				}}
			>
				<BreadcrumbTrail
					items={[
						{ label: "Store", href: "/store" },
						...(currentProduct?.category
							? [{ label: currentProduct.category, href: `/store?search=${encodeURIComponent(currentProduct.category)}` }]
							: []),
						{ label: currentProduct?.name || currentProduct?.title || "Product" },
					]}
				/>
				<ProductDetailSection />
				<ProductReviewSection />
			</Stack>
		</Box>
	);
};

export default Product;
