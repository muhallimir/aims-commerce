import React, { useRef } from "react";
import {
	Box,
	Card,
	CardContent,
	CardActions,
	Typography,
	Rating,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Image from "next/image";
import useScreenSize from "src/hooks/useScreenSize";
import { useDispatch, useSelector } from "react-redux";
import ProductCTA from "../buttons/ProductCTA";
import { useRouter } from "next/router";
import { setCurrentProduct } from "@store/products.slice";
import { updateCartList } from "@store/cart.slice";
import {
	AppState,
	CardsContentProps,
	Product,
	ProductCardProps,
	ProductListState,
} from "@common/interface";
import useCartAnimation from "src/hooks/useCartAnimation";

const CardsContent: React.FC<CardsContentProps> = ({
	product,
	theme,
	isMobile,
}) => {
	const { name, category, brand, price, description, rating, numReviews } =
		product;

	return (
		<CardContent
			sx={{
				padding: theme.spacing(2),
				flexGrow: 1,
				display: "flex",
				flexDirection: "column",
				justifyContent: "space-between",
				height: isMobile ? "auto" : 180,
			}}
		>
			<Typography variant="h6" fontWeight="bold" gutterBottom>
				{name.length > 15 ? `${name.substring(0, 15)}...` : name}
			</Typography>
			<Typography variant="body2" color="text.secondary" gutterBottom>
				{category} • {brand}
			</Typography>
			<Typography variant="body1" color="text.primary" fontWeight="medium">
				${price.toFixed(2)}
			</Typography>
			<Typography variant="body2" color="text.secondary" sx={{ my: 1 }}>
				{description.length > 15
					? `${description.substring(0, isMobile ? 40 : 15)}...`
					: description}
			</Typography>
			<Box display="flex" alignItems="center" justifyContent="center">
				<Rating value={rating} readOnly precision={0.5} size="small" />
				<Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
					({numReviews} reviews)
				</Typography>
			</Box>
		</CardContent>
	);
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
	const { theme: mode } = useSelector((state: { app: AppState }) => state.app);
	const { products } = useSelector(
		(state: { productLists: ProductListState }) => state.productLists,
	);
	const darkMode = mode === "dark";
	const theme = useTheme();
	const { xs } = useScreenSize();
	const { _id, name, image, countInStock } = product;
	const router = useRouter();
	const dispatch = useDispatch();

	const currentProduct = products.find((p: Product) => p?._id === _id);

	const handleCardClick = () => {
		dispatch(setCurrentProduct(currentProduct));
		router.push(`/store/product/${_id}`);
	};

	const productCardRef = useRef<HTMLDivElement>(null);
	const { setIsFlying, startFlyToCartAnimation } = useCartAnimation();

	const handleAddToCart = () => {
		startFlyToCartAnimation(productCardRef);
		setTimeout(() => {
			setIsFlying(false);
			dispatch(updateCartList(product));
		}, 500);
	};

	return (
		<Card
			ref={productCardRef}
			sx={{
				padding: "12px",
				border: darkMode ? "1px solid gold" : "1px solid transparent",
				borderTopLeftRadius: "24px",
				width: xs ? "100%" : 280,
				height: xs ? "auto" : 450,
				backgroundColor: "common.white",
				color: "common.black",
				boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
				borderRadius: 2,
				overflow: "hidden",
				display: "flex",
				flexDirection: "column",
				justifyContent: "space-between",
				transition: "transform 0.3s ease",
				"&:hover": {
					transform: "scale(1.02)",
				},
			}}
		>
			<Box onClick={handleCardClick}>
				<Box
					sx={{
						position: "relative",
						height: xs ? 140 : 180,
						width: "100%",
					}}
				>
					<Image
						src={image}
						alt={name}
						fill
						style={{ objectFit: "contain" }}
						sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
						priority
						quality={85}
					/>
				</Box>
				<CardsContent product={product} theme={theme} isMobile={xs} />
			</Box>

			<CardActions
				sx={{
					display: "flex",
					justifyContent: countInStock === 0 ? "center" : "space-between",
					backgroundColor: "primary.dark",
					padding: theme.spacing(1, 2),
				}}
			>
				<ProductCTA
					variant="contained"
					onClick={handleAddToCart}
					color="primary"
					buttonText={countInStock > 0 ? "Add to Cart" : "Out of Stock"}
					disabled={countInStock === 0}
				/>
				{countInStock > 0 && (
					<Typography variant="body2" color="common.white">
						In stock: {countInStock}
					</Typography>
				)}
			</CardActions>
		</Card>
	);
};

export default ProductCard;
