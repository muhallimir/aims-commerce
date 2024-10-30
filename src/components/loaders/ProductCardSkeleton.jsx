import { useTheme } from "@emotion/react";
import { Box, Card, CardActions, CardContent, Skeleton } from "@mui/material";
import React from "react";

export default function ProductCardSkeleton({ darkMode, isMobile }) {
	const theme = useTheme();

	return (
		<Card
			sx={{
				padding: "12px",
				border: darkMode ? "1px solid gold" : "1px solid transparent",
				borderTopLeftRadius: "24px",
				width: isMobile ? "100%" : 280, // Match ProductCard's width
				height: isMobile ? "auto" : 450, // Fixed height to match ProductCard
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
					height: isMobile ? 120 : 180, // Match ProductCard's image height
					width: "100%",
				}}
			>
				<Skeleton variant="rectangular" height="100%" width="100%" />
			</Box>
			<CardContent
				sx={{
					padding: theme.spacing(2),
					flexGrow: 1,
					display: "flex",
					flexDirection: "column",
					justifyContent: "space-between",
					height: isMobile ? 160 : 180, // Adjust content height for mobile
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
					padding: theme.spacing(1, 2),
				}}
			>
				<Skeleton height={36} width="100%" /> {/* Button */}
			</CardActions>
		</Card>
	);
}
