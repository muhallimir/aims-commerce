import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import AdminHeader from "src/components/headers/AdminHeader";
import AdminSideDrawer from "src/components/drawers/AdminSideDrawer";
import AdminDashboardSection from "src/components/sections/admin/AdminDashboardSection";
import DashboardLayout from "./DashboardLayout";
import ProductManagementLayout from "./ProductManagementLayout";
import UserManagementLayout from "./UserManagementLayout";
import OrderManagementLayout from "./OrderManagementLayout";
import { useSelector } from "react-redux";

const AdminDashboardLayout: React.FC = () => {
	const [isSidebarOpen, setSidebarOpen] = useState(true);
	const { section } = useSelector(({ admin }: any) => admin);

	useEffect(() => {
		if (typeof window !== "undefined") {
			setSidebarOpen(window.screen.width >= 600);
		}
	}, []);

	const renderSection = () => {
		switch (section) {
			case "dashboard":
				return <DashboardLayout />;
			case "products":
				return <ProductManagementLayout />;
			case "users":
				return <UserManagementLayout />;
			case "orders":
				return <OrderManagementLayout />;
			case "support":
				return <Box>Support Section (Coming Soon)</Box>;
			default:
				return <Box>Select a section to view its content.</Box>;
		}
	};

	return (
		<Box
			sx={{
				display: "flex",
				height: "100vh",
				width: "100%",
				bgcolor: "common.white",
			}}
		>
			<AdminSideDrawer
				isSidebarOpen={isSidebarOpen}
				setSidebarOpen={setSidebarOpen}
			/>
			<AdminHeader isSidebarOpen={isSidebarOpen} />
			<AdminDashboardSection isSidebarOpen={isSidebarOpen}>
				{renderSection()}
			</AdminDashboardSection>
		</Box>
	);
};

export default AdminDashboardLayout;
