import React, { useEffect } from "react";
import { Box, Typography, Button, Grid, Paper } from "@mui/material";
import useCartHandling from "src/hooks/useCartHandling";
import Image from "next/image";
import {
	useGetOrderMutation,
	usePostPlaceOrderMutation,
} from "@store/order.slice";
import LoadingOverlay from "src/components/loaders/TextLoader";
import { LOADERTEXT } from "@common/constants";
import { getErrorMessage } from "@helpers/getErrorMessage";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { resetCartState } from "@store/cart.slice";
import { getImageUrl } from "@helpers/commonFn";
import { attractiveGlow, shimmer } from "@common/animations";

const CheckoutLayout: React.FC = () => {
	const { loading: appLoading } = useSelector((state: any) => state.app);
	const { cartItems, shippingAddress, paymentMethod } = useCartHandling();
	const [reqPlaceOrder, resPlaceOrder] = usePostPlaceOrderMutation();
	const { isLoading, isError, error } = resPlaceOrder;
	const [reqGetOrder] = useGetOrderMutation();
	const router = useRouter();
	const dispatch = useDispatch();

	const handlePlaceOrder = () => {
		const itemsPrice = cartItems.reduce(
			(acc: any, item: any) => acc + item.price * item.quantity,
			0,
		);
		const shippingPrice = 0;
		const taxPrice = itemsPrice * 0.15; // 15% tax
		const totalPrice = itemsPrice + shippingPrice + taxPrice;

		const shippingAddressWithContact = {
			...shippingAddress,
			contact: shippingAddress.contactNo,
		};

		const orderItems = cartItems.map((item: any) => ({
			product: item._id,
			qty: item.quantity,
			price: item.price,
			image: item.image,
			name: item.name,
		}));

		const payload = {
			cartItems,
			shippingAddress: shippingAddressWithContact,
			paymentMethod: paymentMethod,
			itemsPrice: itemsPrice,
			shippingPrice: shippingPrice,
			taxPrice: taxPrice,
			totalPrice: totalPrice,
			orderItems,
		};

		reqPlaceOrder(payload);
	};

	const handleRedirectToPayment = async (orderId: string) => {
		try {
			await reqGetOrder({ orderId }).unwrap();
		} catch (error) {
			console.error("Failed to place order:", error);
		} finally {
			dispatch(resetCartState());
			router.replace(`${router.asPath}/${orderId}`);
		}
	};

	useEffect(() => {
		if (resPlaceOrder?.isSuccess) {
			const orderData = resPlaceOrder?.data?.order;
			const { _id: orderId } = orderData || {};
			handleRedirectToPayment(orderId);
		}
	}, [resPlaceOrder, reqGetOrder]);

	const calculateSubtotal = () => {
		return cartItems.reduce(
			(acc: any, item: any) => acc + item.price * item.quantity,
			0,
		);
	};

	const subtotal = calculateSubtotal();
	const tax = subtotal * 0.15;
	const total = subtotal + tax;

	return (
		<Box sx={{ maxWidth: "lg", mx: "auto", p: 3, textAlign: "left" }}>
			{(isLoading || appLoading) && (
				<LoadingOverlay loadingMessage={LOADERTEXT.ORDER_PLACEMENT} />
			)}
			<Grid container spacing={2}>
				<Grid item xs={12} md={8}>
					<Paper elevation={2} sx={{ p: 3, mb: 2, borderRadius: 2 }}>
						<Typography variant="h6" gutterBottom fontWeight="bold">
							Shipping Details
						</Typography>
						<Typography variant="body1" gutterBottom>
							<strong>Name:</strong> {shippingAddress.fullName}
						</Typography>
						<Typography variant="body1" gutterBottom>
							<strong>Contact No:</strong> {shippingAddress.contactNo}
						</Typography>
						<Typography variant="body1">
							<strong>Address:</strong> {shippingAddress.address},{" "}
							{shippingAddress.city}, {shippingAddress.postalCode},{" "}
							{shippingAddress.country}
						</Typography>
					</Paper>
					<Paper
						elevation={2}
						sx={{
							display: "flex",
							flexDirection: "column",
							p: 3,
							borderRadius: 2,
							flex: 1,
							mb: 2,
						}}
					>
						<Box display="flex" flexDirection="row" gap="4px">
							<Typography variant="h6" gutterBottom fontWeight="bold">
								Payment Method:{" "}
							</Typography>
							<Typography component="span" variant="h6" gutterBottom>
								{paymentMethod?.toUpperCase()}
							</Typography>
						</Box>
					</Paper>
					<Paper elevation={2} sx={{ p: 3, mb: 2, borderRadius: 2 }}>
						<Typography variant="h6" gutterBottom fontWeight="bold">
							Order Items
						</Typography>
						{cartItems.map((item: any) => (
							<Box
								key={item._id}
								sx={{
									display: "flex",
									alignItems: "center",
									mb: 2,
									borderBottom: "1px solid #ccc",
									pb: 1,
								}}
							>
								<Image
									src={getImageUrl(item.image)}
									alt={item.name}
									width={50}
									height={50}
									style={{ objectFit: "contain" }}
								/>
								<Box sx={{ ml: 2 }}>
									<Typography variant="body1" fontWeight="medium">
										{item.name}
									</Typography>
									<Typography variant="body2" color="text.secondary">
										Price: ${item.price.toFixed(2)} x {item.quantity}
									</Typography>
									<Typography variant="body2" fontWeight="bold">
										Total: ${(item.price * item.quantity).toFixed(2)}
									</Typography>
								</Box>
							</Box>
						))}
					</Paper>
				</Grid>
				<Grid item xs={12} md={4}>
					<Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
						<Typography variant="h6" gutterBottom fontWeight="bold">
							Order Summary
						</Typography>
						<Box
							sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
						>
							<Typography>Items:</Typography>
							<Typography>${subtotal.toFixed(2)}</Typography>
						</Box>
						<Box
							sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
						>
							<Typography>Shipping:</Typography>
							<Typography>$0.00</Typography>
						</Box>
						<Box
							sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
						>
							<Typography>Tax (15%):</Typography>
							<Typography>${tax.toFixed(2)}</Typography>
						</Box>
						<Box
							sx={{
								display: "flex",
								justifyContent: "space-between",
								fontWeight: "bold",
								mb: 2,
							}}
						>
							<Typography>Order Total:</Typography>
							<Typography>${total.toFixed(2)}</Typography>
						</Box>
						<Button
							onClick={handlePlaceOrder}
							variant="contained"
							color="success"
							fullWidth
							disabled={isLoading}
							sx={{
								py: 1.5,
								fontSize: "1.1rem",
								fontWeight: 700,
								textTransform: "none",
								borderRadius: 3,
								position: "relative",
								overflow: "hidden",
								background: "linear-gradient(45deg, var(--color-success) 30%, #66BB6A 90%)",
								animation: `${attractiveGlow} 2.5s ease-in-out infinite`,
								"&:hover": {
									animation: "none",
									transform: "scale(1.02)",
									boxShadow: "0 6px 25px rgba(40, 167, 69, 0.5)",
									background: "linear-gradient(45deg, #218838 30%, var(--color-success) 90%)",
								},
								"&:disabled": {
									animation: "none",
									opacity: 0.7,
								},
								"&::before": {
									content: '""',
									position: "absolute",
									top: 0,
									left: "-100%",
									width: "100%",
									height: "100%",
									background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
									animation: `${shimmer} 3s ease-in-out infinite`,
								},
							}}
						>
							{isLoading ? "Processing Order..." : "🛒 Place Order"}
						</Button>
						{isError && (
							<Typography
								variant="body2"
								color="error"
								sx={{ mt: 2, textAlign: "center" }}
							>
								{getErrorMessage(error)}. Please try again.
							</Typography>
						)}
					</Paper>
				</Grid>
			</Grid>
		</Box>
	);
};

export default CheckoutLayout;
