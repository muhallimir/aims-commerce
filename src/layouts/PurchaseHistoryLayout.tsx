import {
	clearOrderData,
	setFromPurchaseHistory,
	useGetOrdersHistoryMutation,
} from "@store/order.slice";
import { isEmpty, isUndefined } from "lodash";
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
} from "@mui/material";
import { ViewList, ShoppingCart } from "@mui/icons-material";
import { AppState, Order } from "@common/interface";
import LoadingOverlay from "src/components/loaders/TextLoader";
import { LOADERTEXT } from "@common/constants";

const PurchaseHistoryLayout: React.FC = () => {
	const { loading } = useSelector((state: { app: AppState }) => state.app);
	const { orderList } = useSelector(({ order }: any) => order);
	const [currentPage, setCurrentPage] = useState(1);
	const [ordersPerPage] = useState(5);
	const [reqPurchaseHistory, resPurchaseHistory] =
		useGetOrdersHistoryMutation();
	const router = useRouter();
	const dispatch = useDispatch();
	const { data: resPurchaseHistoryData } = resPurchaseHistory;
	const [withPurchaseHistory, setWithPurchaseHistory] = useState(true);

	console.log({ resPurchaseHistoryData });

	useEffect(() => {
		if (isEmpty(orderList) && isUndefined(resPurchaseHistoryData)) {
			reqPurchaseHistory({});
			dispatch(clearOrderData());
			dispatch(setFromPurchaseHistory(true));
		}
	}, [reqPurchaseHistory, orderList]);

	useEffect(() => {
		if (resPurchaseHistory.isSuccess && isEmpty(resPurchaseHistoryData)) {
			setWithPurchaseHistory(false);
		} else {
			setWithPurchaseHistory(true);
		}
	}, [resPurchaseHistory]);

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

	if (loading) {
		return (
			<LoadingOverlay variant="overlay" loadingMessage={LOADERTEXT.DEFAULT} />
		);
	}

	return (
		<Box sx={{ maxWidth: 600, mx: "auto", p: 2 }}>
			<Typography variant="h4" gutterBottom color="primary">
				Purchase History
			</Typography>
			{withPurchaseHistory && currentOrders.length > 0 ? (
				currentOrders.map((order: Order) => (
					<Card key={order._id} sx={{ mb: 2, borderRadius: 2, boxShadow: 2 }}>
						<CardContent>
							<Typography variant="h6">
								Order Date: {new Date(order.createdAt).toLocaleDateString()}
							</Typography>
							<Typography variant="body1" marginBottom="4px">
								Total: ${order.totalPrice.toFixed(2)}
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
				))
			) : (
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
