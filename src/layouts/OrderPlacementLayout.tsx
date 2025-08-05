import React, { useEffect, useState } from "react";
import {
	Box,
	Typography,
	Grid,
	Paper,
	Alert,
	Chip,
	Button,
} from "@mui/material";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { CheckCircle, Pending } from "@mui/icons-material";
import {
	AppState,
	OrderData,
	OrderItem,
	PaymentDetails,
} from "@common/interface";
import { PayPalButton } from "react-paypal-button-v2";
import {
	clearOrderData,
	useCreateOrderMutation,
	useGetOrderMutation,
} from "@store/order.slice";
import { isEmpty } from "lodash";
import LoadingOverlay from "src/components/loaders/TextLoader";
import { LOADERTEXT } from "@common/constants";
import { getImageUrl } from "@helpers/commonFn";
import useAuthentication from "src/hooks/useAuthentication";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import StripePaymentForm from "src/forms/StripePaymentForm";
import { attractiveGlow, orangeGlow } from "@common/animations";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");

const formatDate = (date: string | undefined) => {
	if (!date) return new Date().toLocaleString();
	const options: Intl.DateTimeFormatOptions = {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		hour12: false,
	};
	return new Date(date).toLocaleString(undefined, options);
};

const OrderPlacementLayout: React.FC = () => {
	const router = useRouter();
	const { isAdmin, userInfo } = useAuthentication();
	const { orderData, fromPurchaseHistory } = useSelector(
		(state: {
			order: { orderData: OrderData; fromPurchaseHistory: boolean };
		}) => state.order,
	);
	const { loading } = useSelector((state: { app: AppState }) => state.app);
	const orderId =
		(router.query._id as string | undefined) ||
		(router.query.orderId as string | undefined);

	const {
		shippingAddress,
		orderItems,
		paymentMethod,
		itemsPrice,
		shippingPrice,
		taxPrice,
		totalPrice,
		isPaid,
		isDelivered,
		user: userId,
	} = orderData || {};

	const [reqCreateOrder] = useCreateOrderMutation();
	const [paymentStatus, setPaymentStatus] = useState<boolean | null>(isPaid);
	const [reqGetOrder] = useGetOrderMutation();
	const [loadedOrderId, setLoadedOrderId] = useState<string | undefined>(
		undefined,
	);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const dispatch = useDispatch();
	const isPaymentVisible = userId === userInfo?._id;

	useEffect(() => {
		if (!loadedOrderId && orderId) {
			setLoadedOrderId(orderId);
		}
	}, [orderId, loadedOrderId]);

	useEffect(() => {
		if (isEmpty(orderData) && loadedOrderId) {
			reqGetOrder({ orderId: loadedOrderId });
		}
	}, [reqGetOrder, loadedOrderId, orderData, isAdmin]);

	// side effect for admin orders viewing
	useEffect(() => {
		if (isAdmin && orderId !== orderData?._id) {
			reqGetOrder({ orderId });
		}
	}, [orderId, orderData._id]);

	useEffect(() => {
		const handlePopState = (e: PopStateEvent) => {
			e.preventDefault();
			if (!fromPurchaseHistory && !router.asPath.includes("/admin/orders")) {
				router.push("/store");
			}
		};

		window.addEventListener("popstate", handlePopState);
		return () => window.removeEventListener("popstate", handlePopState);
	}, [router, fromPurchaseHistory]);

	const handleSuccessPayment = async (details: PaymentDetails) => {
		setIsLoading(true);
		try {
			await reqCreateOrder({
				orderId,
				paymentResult: details,
			}).unwrap();

			setPaymentStatus(true);
		} catch (error) {
			console.error("Failed to create order:", error);
			setErrorMessage(
				"An error occurred while processing your payment. Please try again.",
			);
		} finally {
			dispatch(clearOrderData());
			setIsLoading(false);
		}
	};

	const handlePaymentError = (error: any) => {
		console.error("Payment error:", error);
		setErrorMessage(
			"Payment failed. Please check your payment details and try again.",
		);
	};

	const handleDummyStripePayment = async () => {
		setIsLoading(true);
		try {
			// Simulate Stripe test payment with dummy data
			const dummyPaymentDetails: PaymentDetails = {
				_id: `dummy_${Date.now()}`,
				status: "COMPLETED",
				update_time: new Date().toISOString(),
				payer: {
					email_address: userInfo?.email || "demo@example.com",
				},
			};

			await handleSuccessPayment(dummyPaymentDetails);
		} catch (error) {
			console.error("Dummy payment error:", error);
			setErrorMessage("Demo payment failed. Please try again.");
		}
	};

	if (loading || isLoading) {
		return <LoadingOverlay loadingMessage={LOADERTEXT.ORDER_PLACEMENT} />;
	}

	return (
		<Box sx={{ maxWidth: "lg", mx: "auto", p: 3, textAlign: "left" }}>
			{errorMessage && (
				<Alert severity="error" onClose={() => setErrorMessage(null)}>
					{errorMessage}
				</Alert>
			)}
			<Grid container spacing={2}>
				<Grid item xs={12} md={8}>
					<Paper elevation={2} sx={{ p: 3, mb: 2, borderRadius: 2 }}>
						<Typography variant="h6" gutterBottom fontWeight="bold">
							Shipping Details
						</Typography>
						<Typography variant="body1" gutterBottom>
							<strong>Name:</strong> {shippingAddress?.fullName}
						</Typography>
						<Typography variant="body1" gutterBottom>
							<strong>Contact No:</strong> {shippingAddress?.contact}
						</Typography>
						<Typography variant="body1">
							<strong>Address:</strong> {shippingAddress?.address},{" "}
							{shippingAddress?.city}, {shippingAddress?.postalCode},{" "}
							{shippingAddress?.country}
						</Typography>
					</Paper>
					<Paper
						elevation={2}
						sx={{
							p: 3,
							borderRadius: 2,
							mb: 2,
						}}
					>
						<Box display="flex" flexDirection="row" gap="4px">
							<Typography variant="h6" gutterBottom fontWeight="bold">
								Payment Method:
							</Typography>
							<Typography component="span" variant="h6" gutterBottom>
								{paymentMethod?.toUpperCase()}
							</Typography>
						</Box>
						<Typography variant="body1" gutterBottom>
							<strong>Payment Status:</strong>
							<Chip
								icon={paymentStatus || isPaid ? <CheckCircle /> : <Pending />}
								label={
									paymentStatus || isPaid
										? `Paid at ${formatDate(orderData?.paidAt)}`
										: "Pending"
								}
								color={paymentStatus || isPaid ? "success" : "warning"}
								sx={{ ml: 1, fontWeight: "bold" }}
							/>
						</Typography>
						<Typography variant="body1" gutterBottom>
							<strong>Delivery Status:</strong>
							<Chip
								icon={isDelivered ? <CheckCircle /> : <Pending />}
								label={isDelivered ? "Delivered" : "Pending"}
								color={isDelivered ? "success" : "warning"}
								sx={{ ml: 1, fontWeight: "bold" }}
							/>
						</Typography>
					</Paper>
					<Paper elevation={2} sx={{ p: 3, mb: 2, borderRadius: 2 }}>
						<Typography variant="h6" gutterBottom fontWeight="bold">
							Order Items
						</Typography>
						{orderItems?.map((item: OrderItem) => (
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
										Price: ${item.price.toFixed(2)} x {item.qty}
									</Typography>
									<Typography variant="body2" fontWeight="bold">
										Total: ${(item.price * item.qty).toFixed(2)}
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
							<Typography>${itemsPrice?.toFixed(2)}</Typography>
						</Box>
						<Box
							sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
						>
							<Typography>Shipping:</Typography>
							<Typography>${shippingPrice?.toFixed(2)}</Typography>
						</Box>
						<Box
							sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
						>
							<Typography>Tax:</Typography>
							<Typography>${taxPrice?.toFixed(2)}</Typography>
						</Box>
						<Box
							sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
						>
							<Typography variant="h6" fontWeight="bold">
								Total:
							</Typography>
							<Typography variant="h6" fontWeight="bold">
								${totalPrice?.toFixed(2)}
							</Typography>
						</Box>
						<Box>
							{isAdmin && !isPaid && !isPaymentVisible && (
								<Button
									variant="contained"
									color="primary"
									sx={{ width: "100%" }}
									onClick={() => {
										router.push("/services");
									}}
								>
									Remind Buyer for Payment
								</Button>
							)}
							{!isPaid && isPaymentVisible && (
								<>
									{paymentMethod === "paypal" && (
										<PayPalButton
											amount={totalPrice?.toFixed(2)}
											onSuccess={handleSuccessPayment}
											onError={handlePaymentError}
										/>)}
									{paymentMethod === "stripe" && (
										<Box>
											<Button
												variant="contained"
												color="success"
												fullWidth
												onClick={handleDummyStripePayment}
												disabled={isLoading}
												sx={{
													mb: 2,
													py: 1.5,
													fontSize: "1rem",
													fontWeight: 700,
													textTransform: "none",
													borderRadius: 3,
													position: "relative",
													overflow: "hidden",
													background: "linear-gradient(45deg, #4CAF50 30%, #66BB6A 90%)",
													animation: `${attractiveGlow} 2.5s ease-in-out infinite`,
													"&:hover": {
														animation: "none",
														transform: "scale(1.02)",
														boxShadow: "0 6px 25px rgba(76, 175, 80, 0.5)",
														background: "linear-gradient(45deg, #43A047 30%, #4CAF50 90%)",
													},
													"&:disabled": {
														animation: "none",
														opacity: 0.7,
													},
												}}
											>
												{isLoading ? "Processing..." : "💳 One-Click Demo Payment (Stripe)"}
											</Button>
											<Alert severity="info" sx={{ mb: 2, fontSize: "0.85rem" }}>
												🎯 <strong>Demo Payment:</strong> Uses test card 4242 4242 4242 4242, expires 12/25, CVV 123
											</Alert>
											<Elements stripe={stripePromise}>
												<StripePaymentForm
													amount={totalPrice || 0}
													onSuccess={handleSuccessPayment}
												/>
											</Elements>
										</Box>
									)}
								</>
							)}
							{isPaid && (
								<Button
									variant="contained"
									color="primary"
									fullWidth
									onClick={() => {
										router.push("/services");
									}}
									sx={{
										py: 1.5,
										fontSize: "1rem",
										fontWeight: 600,
										textTransform: "none",
										borderRadius: 3,
										background: isDelivered
											? "linear-gradient(45deg, var(--color-success) 30%, #66BB6A 90%)"
											: "linear-gradient(45deg, var(--primary-aims-main) 30%, var(--primary-aims-light) 90%)",
										animation: `${orangeGlow} 3s ease-in-out infinite`,
										"&:hover": {
											animation: "none",
											transform: "scale(1.02)",
											boxShadow: isDelivered
												? "0 6px 25px rgba(40, 167, 69, 0.4)"
												: "0 6px 25px rgba(10, 102, 194, 0.4)",
											background: isDelivered
												? "linear-gradient(45deg, #218838 30%, var(--color-success) 90%)"
												: "linear-gradient(45deg, var(--primary-aims-dark) 30%, var(--primary-aims-main) 90%)",
										},
									}}
								>
									{isDelivered ? "🧾 View Receipt" : "📦 Track Order"}
								</Button>
							)}
						</Box>
					</Paper>
				</Grid>
			</Grid>
		</Box>
	);
};

export default OrderPlacementLayout;
