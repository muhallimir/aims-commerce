import React, { useEffect, useState } from "react";
import {
	Box,
	Grid,
	Typography,
	Paper,
	Button,
	Pagination,
	Skeleton,
} from "@mui/material";
import useOrderManagement from "src/hooks/useOrderManagement";
import { Order } from "@common/interface";

const OrderManagementLayout: React.FC = ({}) => {
	const [reqAllOrders, orders] = useOrderManagement();
	const [page, setPage] = useState(1);
	const [ordersPerPage] = useState(6);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		reqAllOrders().finally(() => setLoading(false));
	}, []);

	const handleChangePage = (
		event: React.ChangeEvent<unknown>,
		value: number,
	) => {
		setPage(value);
	};

	const sortedOrders = [...orders].sort((a: Order, b: Order) => {
		return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
	});

	const indexOfLastOrder = page * ordersPerPage;
	const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
	const currentOrders = sortedOrders.slice(indexOfFirstOrder, indexOfLastOrder);

	const formatDate = (date: string) => {
		const options: Intl.DateTimeFormatOptions = {
			weekday: "short",
			year: "numeric",
			month: "short",
			day: "numeric",
		};
		return new Date(date).toLocaleDateString("en-US", options);
	};

	return (
		<Box sx={{ p: 2 }}>
			<Typography
				variant="h4"
				gutterBottom
				sx={{ fontWeight: "bold", color: "primary.main" }}
			>
				Order Management
			</Typography>
			<Grid container spacing={3}>
				{currentOrders.map((order: any, index) => (
					<Grid item xs={12} sm={6} md={4} key={order._id || index}>
						<Paper
							sx={{
								p: 3,
								display: "flex",
								flexDirection: "column",
								justifyContent: "space-between",
								minHeight: "260px",
								height: "100%",
								borderRadius: 2,
								boxShadow: 3,
								backgroundColor: "common.white",
								border: `1px solid ${
									order.isPaid && order.isDelivered
										? "var(--color-success)"
										: order.isPaid
										? "var(--color-warning)"
										: "var(--color-error)"
								}`,
								transition: "all 0.3s ease-in-out",
								"&:hover": {
									transform: "scale(1.05)",
									boxShadow: 8,
								},
							}}
						>
							{loading ? (
								<Skeleton
									variant="text"
									width="70%"
									height={28}
									sx={{ mb: 1 }}
								/>
							) : (
								<Typography
									variant="h6"
									noWrap
									sx={{
										fontWeight: "bold",
										color: "#333",
										overflow: "hidden",
										textOverflow: "ellipsis",
										whiteSpace: "nowrap",
									}}
								>
									Order ID: {order._id}
								</Typography>
							)}
							{loading ? (
								<Skeleton
									variant="text"
									width="100%"
									height={20}
									sx={{ mb: 1 }}
								/>
							) : (
								<Typography
									variant="subtitle2"
									color="textSecondary"
									sx={{
										overflow: "hidden",
										textOverflow: "ellipsis",
										whiteSpace: "nowrap",
									}}
								>
									Shipping Address: {order.shippingAddress.fullName},{" "}
									{order.shippingAddress.city}, {order.shippingAddress.country}
								</Typography>
							)}
							{loading ? (
								<Skeleton
									variant="text"
									width="60%"
									height={20}
									sx={{ mb: 1 }}
								/>
							) : (
								<Typography variant="body2" color="textSecondary">
									Order Date: {formatDate(order.createdAt)}
								</Typography>
							)}
							<Box sx={{ mt: 2 }}>
								{loading ? (
									<Skeleton
										variant="text"
										width="80%"
										height={20}
										sx={{ mb: 1 }}
									/>
								) : (
									<Typography
										variant="body2"
										color="textSecondary"
										sx={{
											overflow: "hidden",
											textOverflow: "ellipsis",
											whiteSpace: "nowrap",
										}}
									>
										Items:{" "}
										{order.orderItems.reduce(
											(total: number, item: any) => total + item.qty,
											0,
										)}{" "}
										| Total: $
										{order.orderItems
											.reduce(
												(total: number, item: any) =>
													total + item.price * item.qty,
												0,
											)
											.toFixed(2)}
									</Typography>
								)}
							</Box>
							{loading ? (
								<Skeleton
									variant="text"
									width="100%"
									height={20}
									sx={{ mt: 2 }}
								/>
							) : (
								<Typography
									variant="body2"
									color="textSecondary"
									sx={{
										mt: 2,
										color:
											order.isPaid && order.isDelivered
												? "var(--color-success)"
												: order.isPaid
												? "var(--color-warning)"
												: "var(--color-error)",
										fontWeight: "bold",
									}}
								>
									Status:{" "}
									{order.isPaid && order.isDelivered
										? "Paid & Delivered"
										: order.isPaid
										? "Paid, Delivery in progress"
										: "Not Paid"}
								</Typography>
							)}
							<Box
								sx={{
									flexGrow: 1,
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
									mt: 2,
								}}
							>
								{loading ? (
									<Skeleton variant="rectangular" width="100%" height={36} />
								) : (
									<Button
										variant="contained"
										color="primary"
										sx={{ width: "100%" }}
										onClick={() => {
											window.location.href = `/order/${order._id}`;
										}}
									>
										View Order
									</Button>
								)}
							</Box>
						</Paper>
					</Grid>
				))}
			</Grid>
			<Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
				<Pagination
					count={Math.ceil(orders.length / ordersPerPage)}
					page={page}
					onChange={handleChangePage}
					color="primary"
				/>
			</Box>
		</Box>
	);
};

export default OrderManagementLayout;
