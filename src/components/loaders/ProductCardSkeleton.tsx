import { ProductCardSkeletonProps } from "@common/interface";
import { Box, Card, CardActions, CardContent, Skeleton } from "@mui/material";
import React from "react";

const ProductCardSkeleton: React.FC<ProductCardSkeletonProps> = ({
	darkMode,
	isMobile,
}) => {
	return (
		<Card
			sx={{
				padding: "12px",
				border: darkMode ? "1px solid gold" : "1px solid transparent",
				borderTopLeftRadius: "24px",
				width: isMobile ? "100%" : 280,
				height: isMobile ? "auto" : 450,
				backgroundColor: "common.white",
				color: "common.black",
				boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
				borderRadius: 2,
				overflow: "hidden",
				display: "flex",
				flexDirection: "column",
				justifyContent: "space-between",
			}}
		>
			<Box
				sx={{
					position: "relative",
					height: isMobile ? 120 : 180,
					width: "100%",
				}}
			>
				<Skeleton variant="rectangular" height="100%" width="100%" />
			</Box>
			<CardContent
				sx={{
					padding: "16px",
					flexGrow: 1,
					display: "flex",
					flexDirection: "column",
					justifyContent: "space-between",
					height: isMobile ? 160 : 180,
				}}
			>
				<Skeleton height={20} /> {/* Title */}
				<Skeleton height={16} width="80%" /> {/* Category & Brand */}
				<Skeleton height={20} width="40%" /> {/* Price */}
				<Skeleton height={16} width="60%" /> {/* Description */}
				<Box display="flex" alignItems="center">
					<Skeleton height={20} width="50px" /> {/* Rating */}
					<Skeleton height={20} width="50px" sx={{ ml: 1 }} />{" "}
					{/* Review count */}
				</Box>
			</CardContent>
			<CardActions
				sx={{
					display: "flex",
					justifyContent: "space-between",
					padding: "8px 16px",
				}}
			>
				<Skeleton height={36} width="100%" />
			</CardActions>
		</Card>
	);
};

export default ProductCardSkeleton;
