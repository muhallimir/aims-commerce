import Stack from "@mui/material/Stack";
import ProductDetailSection from "src/components/sections/ProductDetailSection";
import ProductReviewSection from "src/components/sections/ProductReviewSection";

const Product: React.FC = () => {
	return (
		<Stack minHeight="100vh">
			<ProductDetailSection />
			<ProductReviewSection />
		</Stack>
	);
};

export default Product;
