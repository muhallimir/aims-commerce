import React from "react";
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
import { useSelector } from "react-redux";
import ProductCTA from "../buttons/ProductCTA";

const ProductCard = ({ product }) => {
	const { theme: mode } = useSelector(({ app }) => app);
	const darkMode = mode === "dark";
	const theme = useTheme();
	const { xs } = useScreenSize();
	const {
		name,
		category,
		image,
		price,
		countInStock,
		brand,
		rating,
		numReviews,
		description,
	} = product;

	return (
		<Card
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
			<CardContent
				sx={{
					padding: theme.spacing(2),
					flexGrow: 1,
					display: "flex",
					flexDirection: "column",
					justifyContent: "space-between",
					height: xs ? "auto" : 180,
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
						? `${description.substring(0, xs ? 40 : 15)}...`
						: description}
				</Typography>
				<Box display="flex" alignItems="center">
					<Rating value={rating} readOnly precision={0.5} size="small" />
					<Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
						({numReviews} reviews)
					</Typography>
				</Box>
			</CardContent>
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
					countInStock={product.countInStock}
					onClick={() => {}}
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
