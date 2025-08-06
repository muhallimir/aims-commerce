import {
	Box,
	Typography,
	Stack,
	Rating,
	Button,
	Divider,
	Avatar,
	TextField,
	Skeleton,
} from "@mui/material";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { isEmpty } from "lodash";
import { useState } from "react";
import { AppState, Product, RootState } from "@common/interface";
import {
	useGetProductMutation,
	usePostProductReviewMutation,
} from "@store/products.slice";
import useThemeMode from "src/hooks/useThemeMode";

export default function ProductReviewSection() {
	const { currentProduct: product } = useSelector(
		(state: any) => state.productLists,
	) as { currentProduct: Product };
	const { loading } = useSelector((state: { app: AppState }) => state.app);
	const { userInfo } = useSelector((state: RootState) => state.user);
	const { isDarkMode } = useThemeMode();

	const router = useRouter();

	const [comment, setComment] = useState<string>("");
	const [rating, setRating] = useState<number | null>(0);
	const [reqPostReview] = usePostProductReviewMutation();
	const [reqGetProduct] = useGetProductMutation();
	const [errorMessage, setErrorMessage] = useState<string | null>(null); // Add error state

	const handleSignIn = () => {
		window.location.href = "/signin";
	};

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const payload = {
			name: userInfo?.name,
			comment,
			rating: rating?.toString(),
		};
		await reqPostReview({ productId: product?._id, ...payload })
			.unwrap()
			.then(async () => {
				await reqGetProduct({ productId: product?._id });
				setComment("");
				setRating(0);
				setErrorMessage(null);
			})
			.catch((error) => {
				setErrorMessage(
					error?.data?.message ||
					"An error occurred while submitting the review.",
				);
			});
	};

	const sortedReviews = [...(product?.reviews || [])]?.sort(
		(a: any, b: any) => {
			const dateA = new Date(a.updatedAt);
			const dateB = new Date(b.updatedAt);

			return dateB.getTime() - dateA.getTime();
		},
	);

	if (loading) {
		return (
			<Box
				sx={{
					borderRadius: 4,
					overflow: "hidden",
					background: "rgba(255, 255, 255, 0.95)",
					backdropFilter: "blur(20px)",
					border: "1px solid rgba(255, 255, 255, 0.2)",
					boxShadow: "0 32px 64px rgba(0, 0, 0, 0.12)",
					p: { xs: 3, md: 4 },
				}}
			>
				<Skeleton variant="text" width="40%" height={48} sx={{ mb: 4 }} />
				<Skeleton variant="rectangular" width="100%" height={200} sx={{ mb: 3, borderRadius: 2 }} />
				<Skeleton variant="rectangular" width="100%" height={60} sx={{ mb: 3, borderRadius: 2 }} />
				<Skeleton variant="rectangular" width="100%" height={60} sx={{ borderRadius: 2 }} />
			</Box>
		);
	}

	return (
		<Box
			sx={{
				background: "white",
				borderRadius: 2,
				boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
				overflow: "hidden",
			}}
		>
			<Box sx={{ p: { xs: 3, md: 4 } }}>
				<Typography
					variant="h5"
					sx={{
						fontWeight: 700,
						color: "text.primary",
						mb: 3,
						fontSize: { xs: "1.25rem", md: "1.5rem" },
					}}
				>
					Customer Reviews
				</Typography>

				{errorMessage && (
					<Box
						sx={{
							p: 2,
							borderRadius: 2,
							background: "rgba(244, 67, 54, 0.1)",
							border: "1px solid rgba(244, 67, 54, 0.2)",
							mb: 3,
						}}
					>
						<Typography variant="body2" color="error">
							{errorMessage}
						</Typography>
					</Box>
				)}

				{isEmpty(userInfo) ? (
					<Box
						sx={{
							textAlign: "center",
							py: 4,
							borderRadius: 2,
							background: "rgba(0, 0, 0, 0.02)",
							border: "1px dashed rgba(0, 0, 0, 0.1)",
						}}
					>
						<Typography
							variant="body1"
							sx={{
								mb: 2,
								color: "text.secondary",
							}}
						>
							Sign in to add your review
						</Typography>
						<Button
							variant="contained"
							onClick={handleSignIn}
							sx={{
								borderRadius: 2,
								textTransform: "none",
								px: 3,
								py: 1,
								fontSize: "0.9rem",
								fontWeight: 600,
								background: "primary.main",
								color: "white",
								boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
								"&:hover": {
									background: "primary.dark",
								},
							}}
						>
							Sign In
						</Button>
					</Box>
				) : (
					<Box
						component="form"
						onSubmit={handleSubmit}
						sx={{
							p: 3,
							borderRadius: 2,
							background: "rgba(0, 0, 0, 0.02)",
							border: "1px solid rgba(0, 0, 0, 0.06)",
							mb: 3,
						}}
					>
						<Typography
							variant="h6"
							sx={{
								mb: 2,
								fontWeight: 600,
								color: "text.primary",
								fontSize: "1.1rem",
							}}
						>
							Write a Review
						</Typography>
						<Stack spacing={2}>
							<Box>
								<Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
									Rating
								</Typography>
								<Rating
									value={rating}
									onChange={(_, newValue) => setRating(newValue)}
									sx={{
										"& .MuiRating-iconFilled": {
											color: "#ffa726",
										},
									}}
								/>
							</Box>
							<TextField
								label="Write your comment"
								multiline
								rows={3}
								value={comment}
								onChange={(e) => setComment(e.target.value)}
								variant="outlined"
								fullWidth
								size="small"
								sx={{
									"& .MuiOutlinedInput-root": {
										borderRadius: 2,
										background: "white",
									},
								}}
							/>
							<Button
								type="submit"
								variant="contained"
								sx={{
									borderRadius: 2,
									textTransform: "none",
									px: 3,
									py: 1,
									fontSize: "0.9rem",
									fontWeight: 600,
									background: "primary.main",
									color: "white",
									alignSelf: "flex-start",
									"&:hover": {
										background: "primary.dark",
									},
								}}
							>
								Submit Review
							</Button>
						</Stack>
					</Box>
				)}

				{!isEmpty(sortedReviews) ? (
					<Box sx={{ mt: 3 }}>
						<Typography
							variant="h6"
							sx={{
								mb: 2,
								fontWeight: 600,
								color: "text.primary",
								fontSize: "1.1rem",
							}}
						>
							Reviews ({sortedReviews.length})
						</Typography>
						<Stack spacing={2}>
							{sortedReviews.map((review, index) => (
								<Box
									key={index}
									sx={{
										p: 3,
										borderRadius: 2,
										background: "rgba(0, 0, 0, 0.02)",
										border: "1px solid rgba(0, 0, 0, 0.06)",
									}}
								>
									<Box sx={{ mb: 2 }}>
										<Typography
											variant="subtitle2"
											sx={{
												fontWeight: 600,
												color: "text.primary",
												mb: 0.5,
											}}
										>
											{review.name}
										</Typography>
										<Rating
											value={review.rating}
											readOnly
											size="small"
											sx={{
												"& .MuiRating-iconFilled": {
													color: "#ffa726",
												},
											}}
										/>
									</Box>
									<Typography
										variant="body2"
										sx={{
											color: "text.secondary",
											lineHeight: 1.5,
										}}
									>
										{review.comment}
									</Typography>
								</Box>
							))}
						</Stack>
					</Box>
				) : (
					<Box
						sx={{
							textAlign: "center",
							py: 4,
							borderRadius: 2,
							background: "rgba(0, 0, 0, 0.02)",
							border: "1px dashed rgba(0, 0, 0, 0.1)",
						}}
					>
						<Typography
							variant="body1"
							sx={{
								color: "text.secondary",
							}}
						>
							No reviews available for this product
						</Typography>
					</Box>
				)}
			</Box>
		</Box>
	);
}
