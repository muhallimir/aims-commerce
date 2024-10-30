import Box from "@mui/material/Box";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import MainHeader from "src/components/headers/MainHeader";
import ProductDetailSection from "src/components/sections/ProductDetailSection";

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
		<>
			<MainHeader />
			<Box minHeight="100vh">
				<ProductDetailSection product={product} />
			</Box>
		</>
	);
};

export default Product;
