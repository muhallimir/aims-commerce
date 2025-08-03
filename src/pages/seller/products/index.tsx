import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { Container, Typography, Box } from "@mui/material";
import SellerProductsLayout from "src/layouts/SellerProductsLayout";
import MainLayout from "src/layouts/MainLayout";
import LoadingOverlay from "src/components/loaders/TextLoader";

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
		return <LoadingOverlay loadingMessage="Loading..." />;
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
