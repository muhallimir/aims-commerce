import Stack from "@mui/material/Stack";
import { Box } from "@mui/material";
import ProductDetailSection from "src/components/sections/ProductDetailSection";
import ProductReviewSection from "src/components/sections/ProductReviewSection";

const Product: React.FC = () => {
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
				<ProductDetailSection />
				<ProductReviewSection />
			</Stack>
		</Box>
	);
};

export default Product;
