import React, { useEffect } from "react";
import { Box, Typography, Paper, Grid } from "@mui/material";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
	PieChart,
	Pie,
	Cell,
	Legend,
} from "recharts";
import { useSelector } from "react-redux";
import { useGetStoreSummaryMutation } from "@store/summary.slice";
import { RootState } from "@common/interface";
import CountUp from "react-countup";

interface User {
	_id: string | null;
	numUsers: number;
}

interface Order {
	_id: string | null;
	numOrders: number;
	totalSales: number;
}

interface DailyOrder {
	_id: string;
	orders: number;
	sales: number;
}

interface ProductCategory {
	_id: string;
	count: number;
}

interface DashboardData {
	users: User[];
	orders: Order[];
	dailyOrders: DailyOrder[];
	productCategories: ProductCategory[];
}

const DashboardLayout: React.FC = () => {
	const [reqGetSummary] = useGetStoreSummaryMutation();
	const { dashboard } = useSelector(
		(state: RootState) => state.summary as { dashboard: DashboardData },
	);

	useEffect(() => {
		if (!dashboard || Object.keys(dashboard).length === 0) {
			reqGetSummary({});
		}
	}, [dashboard, reqGetSummary]);

	const salesData = (dashboard?.dailyOrders || []).map((order: DailyOrder) => ({
		name: order._id ?? "N/A",
		sales: order.sales ?? 0,
	}));

	const categoryData = (dashboard?.productCategories || []).map(
		(category: ProductCategory) => ({
			name: category._id ?? "N/A",
			value: category.count ?? 0,
		}),
	);

	const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

	const totalUsers = dashboard?.users?.[0]?.numUsers ?? 0;
	const totalOrders = dashboard?.orders?.[0]?.numOrders ?? 0;
	const totalSales = dashboard?.orders?.[0]?.totalSales ?? 0;

	return (
		<Box sx={{ backgroundColor: "transparent", paddingTop: "20px" }}>
			<Grid container spacing={3}>
				<Grid item xs={12} md={4}>
					<Paper elevation={3} sx={{ padding: 2, textAlign: "center" }}>
						<Typography variant="h6" color="primary">
							Total Users
						</Typography>
						<Typography variant="h4" sx={{ fontWeight: "bold", color: "#333" }}>
							<CountUp start={0} end={totalUsers} duration={2} separator="," />
						</Typography>
					</Paper>
				</Grid>

				<Grid item xs={12} md={4}>
					<Paper elevation={3} sx={{ padding: 2, textAlign: "center" }}>
						<Typography variant="h6" color="secondary">
							Total Orders
						</Typography>
						<Typography variant="h4" sx={{ fontWeight: "bold", color: "#333" }}>
							<CountUp start={0} end={totalOrders} duration={2} separator="," />
						</Typography>
					</Paper>
				</Grid>

				<Grid item xs={12} md={4}>
					<Paper elevation={3} sx={{ padding: 2, textAlign: "center" }}>
						<Typography variant="h6" color="status.success">
							Total Sales
						</Typography>
						<Typography
							variant="h4"
							sx={{ fontWeight: "bold", color: "common.black" }}
						>
							$
							<CountUp
								start={0}
								end={totalSales}
								duration={2}
								decimals={2}
								separator=","
							/>
						</Typography>
					</Paper>
				</Grid>

				<Grid item xs={12} md={8}>
					<Paper elevation={3} sx={{ padding: 2 }}>
						<Typography variant="h6" color="secondary" gutterBottom>
							Daily Sales
						</Typography>
						<ResponsiveContainer width="100%" height={300}>
							<LineChart data={salesData}>
								<XAxis dataKey="name" stroke="#333" />
								<YAxis stroke="#333" />
								<Tooltip />
								<Line
									type="monotone"
									dataKey="sales"
									stroke="#8884d8"
									strokeWidth={2}
								/>
							</LineChart>
						</ResponsiveContainer>
					</Paper>
				</Grid>

				<Grid item xs={12} md={4}>
					<Paper elevation={3} sx={{ padding: 2 }}>
						<Typography variant="h6" color="primary" gutterBottom>
							Categories
						</Typography>
						<ResponsiveContainer width="100%" height={300}>
							<PieChart>
								<Pie
									data={categoryData}
									cx="50%"
									cy="50%"
									outerRadius={80}
									fill="#8884d8"
									dataKey="value"
									label
								>
									{categoryData.map((_: any, index: any) => (
										<Cell
											key={`cell-${index}`}
											fill={COLORS[index % COLORS.length]}
										/>
									))}
								</Pie>
								<Legend />
							</PieChart>
						</ResponsiveContainer>
					</Paper>
				</Grid>
			</Grid>
		</Box>
	);
};

export default DashboardLayout;
