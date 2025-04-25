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
					display: "flex",
					flexDirection: "column",
					placeSelf: "center",
					px: { xs: 2, md: 4 },
					py: 4,
					mb: 4,
					borderRadius: "12px",
					boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.1)",
					width: "100%",
					maxWidth: 1300,
					backgroundColor: "var(--background-light)",
					border: isDarkMode ? "1px solid gold" : "1px solid transparent",
				}}
			>
				<Skeleton variant="text" width="40%" height={40} sx={{ mb: 3 }} />
				<Skeleton
					variant="rectangular"
					width="100%"
					height={200}
					sx={{ mb: 2 }}
				/>
				<Skeleton
					variant="rectangular"
					width="100%"
					height={50}
					sx={{ mb: 2 }}
				/>
				<Skeleton
					variant="rectangular"
					width="100%"
					height={50}
					sx={{ mb: 2 }}
				/>
			</Box>
		);
	}

	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				placeSelf: "center",
				px: { xs: 2, md: 4 },
				py: 4,
				mb: 4,
				borderRadius: "12px",
				boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.1)",
				width: "100%",
				maxWidth: 1300,
				backgroundColor: "var(--background-light)",
				border: isDarkMode ? "1px solid gold" : "1px solid transparent",
			}}
		>
			<Typography
				variant="h5"
				sx={{
					fontWeight: "bold",
					color: "var(--primary-aims-main)",
					mb: 3,
					borderBottom: "2px solid var(--background-dark)",
					pb: 1,
				}}
			>
				Customer Reviews
			</Typography>

			{errorMessage && (
				<Typography
					variant="body1"
					color="error"
					sx={{ textAlign: "center", my: 4 }}
				>
					{errorMessage}
				</Typography>
			)}

			{isEmpty(userInfo) ? (
				<Box sx={{ textAlign: "center", my: 4 }}>
					<Typography variant="body1" color="textSecondary" sx={{ mb: 2 }}>
						Sign in to add your review
					</Typography>
					<Button
						variant="contained"
						onClick={handleSignIn}
						color="primary"
						sx={{
							borderRadius: "20px",
							textTransform: "capitalize",
							px: 4,
						}}
					>
						Sign In
					</Button>
				</Box>
			) : (
				<form onSubmit={handleSubmit}>
					<Stack spacing={2} sx={{ mb: 4 }}>
						<Rating
							value={rating}
							onChange={(_, newValue) => {
								setRating(newValue);
							}}
							size="large"
							sx={{ mb: 2 }}
						/>
						<TextField
							label="Write your comment"
							multiline
							rows={4}
							value={comment}
							onChange={(e) => setComment(e.target.value)}
							variant="outlined"
							fullWidth
							sx={{ bgcolor: "white" }}
						/>
						<Button
							type="submit"
							variant="contained"
							color="primary"
							sx={{
								borderRadius: "20px",
								textTransform: "capitalize",
								px: 4,
							}}
						>
							Submit Review
						</Button>
					</Stack>
				</form>
			)}

			{!isEmpty(sortedReviews) ? (
				sortedReviews.map((review, index) => (
					<Box key={index}>
						<Stack
							direction="row"
							alignItems="center"
							textAlign="left"
							spacing={2}
						>
							<Avatar
								alt={review.name}
								sx={{
									bgcolor: "var(--background-dark)",
									width: 48,
									height: 48,
								}}
							>
								{review.name.charAt(0)}
							</Avatar>
							<Box>
								<Typography
									variant="subtitle1"
									fontWeight="bold"
									color="primary"
								>
									{review.name}
								</Typography>
								<Rating value={review.rating} readOnly size="small" />
							</Box>
						</Stack>
						<Typography
							variant="body2"
							color="grey.medium"
							sx={{
								ml: 9,
								lineHeight: 1.8,
								fontStyle: "italic",
								textAlign: "left",
							}}
						>
							{review.comment}
						</Typography>
						{index < product.reviews.length - 1 && (
							<Divider sx={{ my: 2, borderColor: "background.dark" }} />
						)}
					</Box>
				))
			) : (
				<Typography
					variant="body1"
					color="error"
					sx={{ textAlign: "center", my: 4 }}
				>
					No reviews available for this product
				</Typography>
			)}
		</Box>
	);
}
