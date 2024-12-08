import { Box, Card, CardContent, Skeleton, Divider, Grid } from "@mui/material";

const AdminManagementSkeleton: React.FC = ({}) => {
	const skeletonCards = Array.from({ length: 6 }).map((_, index) => (
		<Grid item xs={12} sm={6} md={4} key={index}>
			<Card sx={{ borderRadius: 2, boxShadow: 2, height: "100%" }}>
				<CardContent>
					<Skeleton variant="text" width="60%" height={32} />
					<Skeleton variant="text" width="40%" height={24} />
					<Skeleton variant="rectangular" height={32} sx={{ my: 2 }} />
					<Divider sx={{ my: 2 }} />
					<Box sx={{ mb: 0 }}>
						<Skeleton variant="text" width="80%" height={24} />
						<Skeleton variant="text" width="40%" height={20} />
					</Box>
					<Box sx={{ mb: 2 }}>
						<Skeleton variant="text" width="80%" height={24} />
						<Skeleton variant="text" width="40%" height={20} />
					</Box>
					<Divider sx={{ my: 2 }} />
					<Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
						<Skeleton variant="rectangular" width={80} height={36} />
						<Skeleton variant="rectangular" width={80} height={36} />
						<Skeleton variant="circular" width={36} height={36} />
					</Box>
				</CardContent>
			</Card>
		</Grid>
	));

	return (
		<Box sx={{ maxWidth: 1000, mx: "auto", p: 2 }}>
			<Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
				<Skeleton variant="rectangular" width={200} height={40} />
			</Box>
			<Grid container spacing={2}>
				{skeletonCards}
			</Grid>
			<Divider sx={{ my: 2 }} />
			<Skeleton
				variant="rectangular"
				width={200}
				height={36}
				sx={{ mx: "auto", mt: 2 }}
			/>
		</Box>
	);
};

export default AdminManagementSkeleton;
