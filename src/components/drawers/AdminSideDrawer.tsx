import React from "react";
import {
	Box,
	Drawer,
	List,
	ListItem,
	ListItemIcon,
	Toolbar,
	IconButton,
	Typography,
	useTheme,
} from "@mui/material";
import {
	Home as HomeIcon,
	Inventory as ProductsIcon,
	People as AccountsIcon,
	Receipt as OrdersIcon,
	SupportAgent as SupportIcon,
	Menu as MenuIcon,
} from "@mui/icons-material";
import GridViewIcon from "@mui/icons-material/GridView";
import useThemeMode from "src/hooks/useThemeMode";
import mainLogo from "@public/assets/aims-logo.png";
import mainDarkLogo from "@public/assets/aims-logo-dark.png";
import useScreenSize from "src/hooks/useScreenSize";
import Image from "next/image";
import { useRouter } from "next/router";
import { AdminSideDrawerProps } from "@common/interface";
import DashboardLayout from "src/layouts/DashboardLayout";
import UserManagementLayout from "src/layouts/UserManagementLayout";
import OrderManagementLayout from "src/layouts/OrderManagementLayout";
import { useDispatch, useSelector } from "react-redux";
import { switchSection } from "@store/admin.slice";

const AdminSideDrawer: React.FC<AdminSideDrawerProps> = ({
	isSidebarOpen,
	setSidebarOpen,
}) => {
	const { section } = useSelector(({ admin }: any) => admin);
	const { isDarkMode } = useThemeMode();
	const { xs } = useScreenSize();
	const router = useRouter();
	const theme = useTheme();
	const dispatch = useDispatch();

	const navItems = [
		{ text: "Home", icon: <HomeIcon />, route: "/store" },
		{
			text: "Summary",
			icon: <GridViewIcon />,
			component: <DashboardLayout />,
			section: "dashboard",
		},
		{
			text: "Products",
			icon: <ProductsIcon />,
			component: <DashboardLayout />,
			section: "products",
		},
		{
			text: "Users",
			icon: <AccountsIcon />,
			component: <UserManagementLayout />,
			section: "users",
		},
		{
			text: "Orders",
			icon: <OrdersIcon />,
			component: <OrderManagementLayout />,
			section: "orders",
		},
		{ text: "Support", icon: <SupportIcon />, section: "support" },
	];

	const handleNavItemClick = (route: string) => {
		router.push(route);
	};

	const handleSectionNav = (section: string | undefined) => {
		dispatch(switchSection(section));
		if (xs) setSidebarOpen(false);
	};

	return (
		<Drawer
			variant="permanent"
			open={isSidebarOpen}
			sx={{
				width: isSidebarOpen && !xs ? 220 : 64,
				flexShrink: 0,
				padding: "10px 4px",
				"& .MuiDrawer-paper": {
					width: isSidebarOpen ? 220 : 64,
					boxSizing: "border-box",
					backgroundColor: isDarkMode ? "common.black" : "common.white",
					boxShadow: isDarkMode
						? "0px 4px 10px gold"
						: "0px 2px 6px rgba(0, 0, 0, 0.1)",
					transition: "width 0.3s ease",
				},
			}}
		>
			<Toolbar
				sx={{
					display: "flex",
					alignItems: "center",
					justifyContent: isSidebarOpen ? "space-between" : "center",
				}}
			>
				<Box
					sx={{
						position: "relative",
						padding: "1px",
						borderRadius: "5px",
						border: `1px solid transparent`,
						backgroundColor: isDarkMode ? "transparent" : "none",
						boxShadow: isDarkMode ? "0 0 5px gold, 0 0 10px gold" : "none",
					}}
					onClick={() => router.push("/store")}
				>
					{isSidebarOpen && (
						<Image
							alt="main-logo"
							src={isDarkMode ? mainDarkLogo : mainLogo}
							width={xs ? 80 : 100}
							height={xs ? 30 : 40}
							priority
						/>
					)}
				</Box>
				<IconButton
					sx={{
						color: isDarkMode ? "common.white" : "common.black",
					}}
					onClick={() => setSidebarOpen(!isSidebarOpen)}
				>
					<MenuIcon />
				</IconButton>
			</Toolbar>
			<List
				sx={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					mt: "8px",
				}}
			>
				{navItems.map((item, index) => {
					const isActive =
						(item.route && router.pathname === item.route) ||
						(item.section && section === item.section);
					return (
						<ListItem
							key={index}
							sx={{
								color: isDarkMode ? "common.white" : "common.black",
								cursor: "pointer",
								backgroundColor: isActive
									? isDarkMode
										? "rgba(255, 255, 255, 0.2)"
										: "rgba(0, 0, 0, 0.1)"
									: "transparent",
								"&:hover": {
									backgroundColor: isDarkMode
										? "rgba(255, 255, 255, 0.1)"
										: "rgba(0, 0, 0, 0.05)",
								},
								paddingLeft: isSidebarOpen ? 3 : 1,
								transition: "background-color 0.2s ease",
							}}
							onClick={() =>
								item.route
									? handleNavItemClick(item.route)
									: handleSectionNav(item.section)
							}
						>
							<ListItemIcon
								sx={{
									color: isDarkMode ? "common.white" : "common.black",
									justifyContent: isSidebarOpen ? "flex-start" : "center",
									fontWeight: 400,
									fontSize: "0.8rem",
									lineHeight: "1rem",
									[theme.breakpoints.up("sm")]: {
										fontSize: "0.875rem",
										lineHeight: "1.25rem",
									},
									[theme.breakpoints.up("md")]: {
										fontSize: "1rem",
										lineHeight: "1.5rem",
									},
								}}
							>
								{item.icon}
							</ListItemIcon>
							{isSidebarOpen && (
								<Typography
									variant="body2"
									sx={{
										color: isDarkMode ? "common.white" : "common.black",
									}}
								>
									{item.text}
								</Typography>
							)}
						</ListItem>
					);
				})}
			</List>
		</Drawer>
	);
};

export default AdminSideDrawer;
