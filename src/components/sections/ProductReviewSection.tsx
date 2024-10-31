import {
	Box,
	Typography,
	Stack,
	Rating,
	Button,
	Divider,
	Avatar,
	TextField,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { isEmpty } from "lodash";
import { useState } from "react";
import { Product, RootState } from "@common/interface";

export default function ProductReviewSection() {
	const { currentProduct: product } = useSelector(
		(state: any) => state.productLists,
	) as { currentProduct: Product };
	const theme = useTheme();
	const { theme: mode } = useSelector((state: RootState) => state.app);
	const { userInfo } = useSelector((state: RootState) => state.user);
	const router = useRouter();

	const [comment, setComment] = useState<string>("");
	const [rating, setRating] = useState<number | null>(0);

	const handleSignIn = () => {
		router.push("/login");
	};

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		// Handle the submission of the comment and rating here
		console.log("Comment submitted:", comment, "Rating:", rating);
		// Reset the form after submission
		setComment("");
		setRating(0);
	};

	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				placeSelf: "center",
				px: { xs: 2, md: 4 },
				py: 4,
				borderRadius: "12px",
				boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.1)",
				width: "100%",
				maxWidth: 1300,
				backgroundColor: "var(--background-light)",
				border: mode === "dark" ? "1px solid gold" : "1px solid transparent",
			}}
		>
			<Typography
				variant="h5"
				sx={{
					fontWeight: "bold",
					color: "var(--primary-aims-main)",
					mb: 3,
					borderBottom: `2px solid ${theme.palette.divider}`,
					pb: 1,
				}}
			>
				Customer Reviews
			</Typography>

			{isEmpty(userInfo) ? (
				<Box sx={{ textAlign: "center", my: 4 }}>
					<Typography variant="body1" color="textSecondary" sx={{ mb: 2 }}>
						Sign in to add your review
					</Typography>
					<Button
						variant="contained"
						onClick={handleSignIn}
						color="secondary"
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
							onChange={(event, newValue) => {
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
							sx={{ bgcolor: "white" }} // Optional: Change background color
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

			{product?.reviews?.length > 0 ? (
				product.reviews.map((review, index) => (
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
									sx={{ color: theme.palette.text.primary }}
								>
									{review.name}
								</Typography>
								<Rating value={review.rating} readOnly size="small" />
							</Box>
						</Stack>
						<Typography
							variant="body2"
							sx={{
								color: theme.palette.text.secondary,
								ml: 9,
								lineHeight: 1.8,
								fontStyle: "italic",
								textAlign: "left",
							}}
						>
							{review.comment}
						</Typography>
						{index < product.reviews.length - 1 && (
							<Divider sx={{ my: 2, borderColor: theme.palette.divider }} />
						)}
					</Box>
				))
			) : (
				<Typography
					variant="body1"
					color="textSecondary"
					sx={{ textAlign: "center", my: 4 }}
				>
					No reviews available for this product
				</Typography>
			)}
		</Box>
	);
}
