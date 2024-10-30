import { Box, Rating, Typography } from "@mui/material";

export default function ProductReviewSection({ product }) {
	return (
		<Box sx={{ mt: 4 }}>
			<Typography variant="h5">Customer Reviews</Typography>
			{product?.reviews.map((review, index) => (
				<Box key={index} sx={{ mt: 2 }}>
					<Typography variant="body2" fontWeight="bold">
						{review.name}
					</Typography>
					<Rating value={review.rating} readOnly size="small" />
					<Typography variant="body2">{review.comment}</Typography>
				</Box>
			))}
		</Box>
	);
}
