import {
	clearOrderData,
	setFromPurchaseHistory,
	useGetOrdersHistoryMutation,
} from "@store/order.slice";
import { isEmpty, isNull } from "lodash";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import {
	Box,
	Button,
	Chip,
	Divider,
	Card,
	CardContent,
	Typography,
	Pagination,
	Grid,
	Skeleton,
} from "@mui/material";
import { ViewList, ShoppingCart } from "@mui/icons-material";
import { AppState, Order } from "@common/interface";

const PurchaseHistoryLayout: React.FC = () => {
	const { loading } = useSelector((state: { app: AppState }) => state.app);
	const { orderList } = useSelector(({ order }: any) => order);
	const [currentPage, setCurrentPage] = useState(1);
	const [ordersPerPage] = useState(6);
	const [reqPurchaseHistory, resPurchaseHistory] =
		useGetOrdersHistoryMutation();
	const router = useRouter();
	const dispatch = useDispatch();
	const {
		data: resPurchaseHistoryData,
		isLoading: resPurchaseHistoryDataLoading,
	} = resPurchaseHistory;
	const [withPurchaseHistory, setWithPurchaseHistory] = useState<
		boolean | null
	>(null);

	useEffect(() => {
		if (isNull(withPurchaseHistory)) {
			reqPurchaseHistory({});
			dispatch(clearOrderData());
			dispatch(setFromPurchaseHistory(true));
		}
	}, [reqPurchaseHistory, withPurchaseHistory]);

	useEffect(() => {
		if (resPurchaseHistory.isSuccess) {
			setWithPurchaseHistory(!isEmpty(resPurchaseHistoryData));
		}
	}, [resPurchaseHistory, resPurchaseHistoryData]);

	useEffect(() => {
		dispatch(clearOrderData());
	}, []);

	const indexOfLastOrder = currentPage * ordersPerPage;
	const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;

	const sortedOrders = [...orderList].sort((a: Order, b: Order) => {
		return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
	});

	const currentOrders = sortedOrders.slice(indexOfFirstOrder, indexOfLastOrder);

	const handlePageChange = (
		event: React.ChangeEvent<unknown>,
		value: number,
	) => {
		setCurrentPage(value);
	};

	const handleViewDetails = (orderId: string) => {
		router.push(`/store/checkout/${orderId}`);
	};

	const handleRedirectToStore = () => {
		router.push("/store");
	};

	return (
		<Box sx={{ maxWidth: "100%", mx: "auto", p: 2 }}>
			<Typography variant="h4" gutterBottom color="primary">
				Purchase History
			</Typography>
			{loading || resPurchaseHistoryDataLoading ? (
				<Grid
					container
					spacing={2}
					justifyContent="center"
					sx={{ maxWidth: 1200, mx: "auto" }}
				>
					{Array.from(new Array(6)).map((_, index) => (
						<Grid item xs={12} sm={6} md={4} lg={4} key={index}>
							<Card sx={{ borderRadius: 2, boxShadow: 2 }}>
								<CardContent>
									<Skeleton variant="text" height={30} width="80%" />
									<Skeleton variant="text" height={20} width="60%" />
									<Skeleton variant="text" height={20} width="40%" />
									<Skeleton
										variant="rectangular"
										height={40}
										width="100%"
										sx={{ my: 1 }}
									/>
									<Divider sx={{ my: 2 }} />
									<Skeleton variant="rectangular" height={36} width="100%" />
								</CardContent>
							</Card>
						</Grid>
					))}
				</Grid>
			) : !withPurchaseHistory && currentOrders.length === 0 ? (
				<Box textAlign="center">
					<Typography variant="body1" color="textSecondary" align="center">
						No purchase history available.
					</Typography>
					<Button
						variant="outlined"
						startIcon={<ShoppingCart />}
						sx={{ mt: 2 }}
						onClick={handleRedirectToStore}
					>
						Go to Store
					</Button>
				</Box>
			) : (
				<Grid
					container
					spacing={2}
					justifyContent="center"
					sx={{ maxWidth: 1200, mx: "auto" }}
				>
					{currentOrders.map((order: Order) => (
						<Grid item xs={12} sm={6} md={4} lg={4} key={order._id}>
							<Card sx={{ borderRadius: 2, boxShadow: 2 }}>
								<CardContent>
									<Typography variant="h6">
										Order Date: {new Date(order.createdAt).toLocaleDateString()}
									</Typography>
									<Typography variant="body1" marginBottom="4px">
										Total: ${order.totalPrice.toFixed(2)}
									</Typography>
									<Typography variant="body2" marginBottom="4px">
										Ordered By: {order?.shippingAddress?.fullName}
									</Typography>
									<Chip
										label={order.isPaid ? "Paid" : "Not Paid"}
										color={order.isPaid ? "success" : "error"}
										sx={{ mr: 1 }}
									/>
									<Chip
										label={order.isDelivered ? "Delivered" : "Not Delivered"}
										color={order.isDelivered ? "success" : "error"}
									/>
									<Divider sx={{ my: 2 }} />
									<Button
										variant="contained"
										startIcon={<ViewList />}
										sx={{ bgcolor: "primary.main", color: "white" }}
										onClick={() => handleViewDetails(order._id)}
									>
										View Details
									</Button>
								</CardContent>
							</Card>
						</Grid>
					))}
				</Grid>
			)}
			{withPurchaseHistory && currentOrders.length > 0 && (
				<>
					<Divider sx={{ my: 2 }} />
					<Pagination
						count={Math.ceil(orderList.length / ordersPerPage)}
						page={currentPage}
						onChange={handlePageChange}
						variant="outlined"
						color="primary"
						sx={{ display: "flex", justifyContent: "center", my: 2 }}
					/>
				</>
			)}
		</Box>
	);
};

export default PurchaseHistoryLayout;
