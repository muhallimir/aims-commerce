import React, { useEffect } from "react";
import MainLayout from "src/layouts/MainLayout";
import { Box, Button, Typography, Container, Grid, Card, CardContent, Skeleton } from "@mui/material";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import {
	Dashboard as DashboardIcon,
	Add as AddIcon,
	Store as StoreIcon,
} from "@mui/icons-material";

const StartSellingPage: React.FC = () => {
	const router = useRouter();
	const { userInfo } = useSelector((state: any) => state.user);
	const { loading } = useSelector((state: any) => state.app);

	useEffect(() => {
		// Check if user is authenticated
		if (!userInfo && !loading) {
			router.push("/signin");
			return;
		}

		// Check if user is a seller
		if (userInfo && !userInfo.isSeller) {
			router.push("/start-selling");
			return;
		}
	}, [userInfo, router, loading]);

	// Show loading while checking authentication
	if (loading || !userInfo) {
		return (
			<MainLayout>
				<Container maxWidth="lg" sx={{ py: 8 }}>
					<Box textAlign="center" mb={6}>
						<Skeleton variant="text" width={300} height={60} sx={{ mx: "auto", mb: 2 }} />
						<Skeleton variant="text" width={500} height={24} sx={{ mx: "auto" }} />
					</Box>

					<Grid container spacing={4}>
						{Array(3).fill(0).map((_, index) => (
							<Grid item xs={12} md={4} key={index}>
								<Card sx={{ textAlign: "center", p: 3 }}>
									<CardContent>
										<Skeleton variant="circular" width={64} height={64} sx={{ mx: "auto", mb: 2 }} />
										<Skeleton variant="text" width="80%" height={28} sx={{ mx: "auto", mb: 1 }} />
										<Skeleton variant="text" width="100%" height={20} sx={{ mx: "auto" }} />
									</CardContent>
								</Card>
							</Grid>
						))}
					</Grid>

					<Box textAlign="center" mt={6}>
						<Skeleton variant="rectangular" width={200} height={48} sx={{ mx: "auto" }} />
					</Box>
				</Container>
			</MainLayout>
		);
	}

	// Show loading if user is not a seller (while redirecting)
	if (!userInfo.isSeller) {
		return (
			<MainLayout>
				<Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "50vh" }}>
					<Box textAlign="center">
						<Skeleton variant="circular" width={60} height={60} sx={{ mx: "auto", mb: 2 }} />
						<Skeleton variant="text" width={150} height={24} sx={{ mx: "auto" }} />
					</Box>
				</Box>
			</MainLayout>
		);
	}

	const handleGoToDashboard = () => {
		router.push("/seller/dashboard");
	};

	const handleAddProduct = () => {
		router.push("/seller/products/new");
	};

	return (
		<MainLayout>
			<Container maxWidth="md" sx={{ minHeight: "80vh" }}>
				<Box
					sx={{
						p: 4,
						boxShadow: 3,
						borderRadius: 2,
						backgroundColor: "common.white",
						textAlign: "center",
					}}
				>
					<StoreIcon sx={{ fontSize: 64, color: "primary.main", mb: 2 }} />
					<Typography variant="h3" mb={2} fontWeight={700} color="primary">
						Welcome to Your Seller Journey!
					</Typography>
					<Typography variant="h6" mb={4} color="text.secondary">
						You're now a seller! Let's get your store up and running.
					</Typography>

					<Grid container spacing={3} sx={{ mt: 2 }}>
						<Grid item xs={12} md={6}>
							<Card sx={{ height: "100%" }}>
								<CardContent sx={{ textAlign: "center", p: 3 }}>
									<DashboardIcon sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />
									<Typography variant="h5" gutterBottom>
										Seller Dashboard
									</Typography>
									<Typography variant="body1" color="text.secondary" mb={3}>
										Manage your products, view orders, track analytics, and more from your comprehensive seller dashboard.
									</Typography>
									<Button
										variant="contained"
										color="primary"
										size="large"
										onClick={handleGoToDashboard}
										fullWidth
									>
										Go to Dashboard
									</Button>
								</CardContent>
							</Card>
						</Grid>

						<Grid item xs={12} md={6}>
							<Card sx={{ height: "100%" }}>
								<CardContent sx={{ textAlign: "center", p: 3 }}>
									<AddIcon sx={{ fontSize: 48, color: "success.main", mb: 2 }} />
									<Typography variant="h5" gutterBottom>
										Add Your First Product
									</Typography>
									<Typography variant="body1" color="text.secondary" mb={3}>
										Start selling by adding your first product. Upload images, set prices, and manage inventory.
									</Typography>
									<Button
										variant="contained"
										color="success"
										size="large"
										onClick={handleAddProduct}
										fullWidth
									>
										Add Product
									</Button>
								</CardContent>
							</Card>
						</Grid>
					</Grid>

					<Box sx={{ mt: 4 }}>
						<Typography variant="body1" color="text.secondary">
							Need help getting started? Check out our seller guide or contact support.
						</Typography>
					</Box>
				</Box>
			</Container>
		</MainLayout>
	);
};

export default StartSellingPage;
