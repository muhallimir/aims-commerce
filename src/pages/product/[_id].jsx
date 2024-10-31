import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Stack from "@mui/material/Stack";
import { useSelector } from "react-redux";
import ProductDetailSection from "src/components/sections/ProductDetailSection";
import ProductReviewSection from "src/components/sections/ProductReviewSection";

const Product = () => {
	const router = useRouter();
	const productId = router?.query?._id;
	const { products } = useSelector(({ productLists }) => productLists);
	const [product, setProduct] = useState(null);

	useEffect(() => {
		const selectedProduct = products?.find((p) => p._id === productId);
		setProduct(selectedProduct);
	}, [productId, products]);

	return (
		<Stack minHeight="100vh">
			<ProductDetailSection product={product} />
			<ProductReviewSection product={product} />
		</Stack>
	);
};

export default Product;
