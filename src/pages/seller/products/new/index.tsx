import React, { useEffect } from "react";
import { Container } from "@mui/material";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import SellerProductForm from "src/forms/SellerProductForm";
import MainLayout from "src/layouts/MainLayout";
import LoadingOverlay from "src/components/loaders/TextLoader";

const SellerNewProduct = () => {
	const router = useRouter();
	const { userInfo } = useSelector((state: any) => state.user);
	const { loading } = useSelector((state: any) => state.app);
	const rehydrated = useSelector((state: any) => state._persist?.rehydrated);

	useEffect(() => {
		// Wait for redux-persist: first paint runs on initial state.
		if (!rehydrated) return;
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
	}, [userInfo, router, loading, rehydrated]);

	// Show loading while checking authentication
	if (!rehydrated || loading || !userInfo) {
		return <LoadingOverlay loadingMessage="Loading..." />;
	}

	// Show loading if user is not a seller (while redirecting)
	if (!userInfo.isSeller) {
		return <LoadingOverlay loadingMessage="Redirecting..." />;
	}

	return (
		<MainLayout>
			<Container maxWidth="lg" sx={{ py: 4 }}>
				<SellerProductForm />
			</Container>
		</MainLayout>
	);
};

export default SellerNewProduct;
