import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { Container, Typography, Box, Skeleton, Grid, Card, CardContent } from "@mui/material";
import SellerProductsLayout from "src/layouts/SellerProductsLayout";
import MainLayout from "src/layouts/MainLayout";

const SellerProducts = () => {
	const router = useRouter();
	const { userInfo } = useSelector((state: any) => state.user);
	const { loading } = useSelector((state: any) => state.app);

	useEffect(() => {
		// Check if user is authenticated and is a seller
		if (!userInfo) {
			router.push("/signin");
			return;
		}

		if (!userInfo.isSeller) {
			router.push("/start-selling");
			return;
		}
	}, [userInfo, router]);

	// Show loading while checking authentication
	if (loading || !userInfo || !userInfo.isSeller) {
		return (
			<MainLayout>
				<Container maxWidth="xl" sx={{ py: 4 }}>
					<Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
						<Skeleton variant="text" width={200} height={48} />
						<Skeleton variant="rectangular" width={120} height={40} />
					</Box>

					<Skeleton variant="rectangular" width="100%" height={56} sx={{ mb: 3 }} />

					<Grid container spacing={3} sx={{ mt: 1 }}>
						{Array(6).fill(0).map((_, index) => (
							<Grid item xs={12} sm={6} md={4} key={index}>
								<Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
									<Skeleton variant="rectangular" height={200} />
									<CardContent sx={{ flexGrow: 1 }}>
										<Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
											<Skeleton variant="text" width="60%" height={28} />
											<Skeleton variant="rectangular" width={80} height={24} />
										</Box>
										<Skeleton variant="text" width="40%" height={20} sx={{ mb: 1 }} />
										<Skeleton variant="text" width="30%" height={28} sx={{ mb: 1 }} />
										<Skeleton variant="text" width="50%" height={20} sx={{ mb: 1 }} />
										<Skeleton variant="text" width="90%" height={20} />
										<Skeleton variant="text" width="70%" height={20} />
									</CardContent>
									<Box display="flex" justifyContent="space-between" p={2}>
										<Skeleton variant="rectangular" width={60} height={32} />
										<Skeleton variant="rectangular" width={70} height={32} />
									</Box>
								</Card>
							</Grid>
						))}
					</Grid>
				</Container>
			</MainLayout>
		);
	}

	return (
		<MainLayout>
			<Container maxWidth="xl" sx={{ py: 4 }}>
				<SellerProductsLayout />
			</Container>
		</MainLayout>
	);
};

export default SellerProducts;
