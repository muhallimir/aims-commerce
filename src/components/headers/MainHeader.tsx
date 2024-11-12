import React, { useEffect, useState } from "react";
import {
	Box,
	Button,
	IconButton,
	Drawer,
	Badge,
	Menu,
	MenuItem,
	Typography,
} from "@mui/material";
import { useSelector } from "react-redux";
import Image from "next/image";
import mainLogo from "@public/assets/aims-logo.png";
import mainDarkLogo from "@public/assets/aims-logo-dark.png";
import MenuIcon from "@mui/icons-material/Menu";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useGetProductListMutation } from "@store/products.slice";
import { useRouter } from "next/router";
import CartDrawer from "../drawers/CartDrawer";
import useThemeMode from "src/hooks/useThemeMode";
import { SignInProps } from "@common/interface";
import useAuthentication from "src/hooks/useAuthentication";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import WbSunnyIcon from "@mui/icons-material/WbSunny"; // Sun icon
import NightsStayIcon from "@mui/icons-material/NightsStay"; // Moon icon
import useScreenSize from "src/hooks/useScreenSize";

const SignInButton: React.FC<SignInProps> = ({ isDarkMode }) => {
	const { userInfo, isAuthenticated, handleSignIn, handleSignOut } =
		useAuthentication();
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const router = useRouter();

	const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
	};

	const handleRedirectToProfile = () => {
		handleMenuClose();
		router.push("/profile");
	};

	const redirectToPurchases = () => {
		handleMenuClose();
		router.push("/purchases");
	};

	const handleLogout = () => {
		handleSignOut();
		handleMenuClose();
	};

	const truncatedName =
		isAuthenticated && userInfo?.name.length > 6
			? `${userInfo?.name.slice(0, 6)}...`
			: userInfo?.name;

	return (
		<>
			<Button
				variant="text"
				onClick={() => {
					if (!isAuthenticated) handleSignIn();
				}}
				sx={{
					ml: 2,
					color: isDarkMode ? "common.white" : "common.black",
					display: "flex",
					flexDirection: "column",
					alignItems: "flex-start",
					textTransform: "none",
					p: 0,
					minWidth: "auto",
					"&:hover": {
						backgroundColor: "transparent",
					},
				}}
			>
				<Typography variant="caption" sx={{ lineHeight: 1 }}>
					{isAuthenticated ? "Welcome," : "Hello,"}
				</Typography>
				<Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
					<Typography
						variant="body2"
						sx={{
							fontWeight: "bold",
							fontSize: "0.9rem",
							lineHeight: { xs: 1, md: isAuthenticated ? 0.5 : 1 },
						}}
					>
						{isAuthenticated ? truncatedName : "Sign in"}
					</Typography>
					{isAuthenticated && (
						<Box
							onClick={handleMenuOpen}
							sx={{ cursor: "pointer", display: "flex", alignItems: "center" }}
						>
							<ArrowDropDownIcon fontSize="small" />
						</Box>
					)}
				</Box>
			</Button>
			<Menu
				anchorEl={anchorEl}
				open={Boolean(anchorEl)}
				onClose={handleMenuClose}
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "center",
				}}
				transformOrigin={{
					vertical: "top",
					horizontal: "center",
				}}
			>
				<MenuItem onClick={handleRedirectToProfile}>
					<Typography variant="body2" sx={{ fontSize: "0.75rem" }}>
						Profile
					</Typography>
				</MenuItem>
				<MenuItem onClick={redirectToPurchases}>
					<Typography variant="body2" sx={{ fontSize: "0.75rem" }}>
						Purchases
					</Typography>
				</MenuItem>
				<MenuItem onClick={handleLogout}>
					<Typography variant="body2" sx={{ fontSize: "0.75rem" }}>
						Logout
					</Typography>
				</MenuItem>
			</Menu>
		</>
	);
};

const AdminAccessButton: React.FC<SignInProps> = ({ isDarkMode }) => {
	const { isAdmin, isAuthenticated } = useAuthentication();
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const router = useRouter();

	const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
	};

	const handleRedirectToDashboard = () => {
		handleMenuClose();
		router.push("/admin/dashboard");
	};

	const handleRedirectToUsers = () => {
		handleMenuClose();
		router.push("/admin/users");
	};

	const handleRedirectToProducts = () => {
		handleMenuClose();
		router.push("/admin/products");
	};

	const handleRedirectToOrders = () => {
		handleMenuClose();
		router.push("/admin/orders");
	};

	return (
		<>
			<Button
				variant="text"
				onClick={handleMenuOpen}
				sx={{
					ml: 2,
					color: isDarkMode ? "common.white" : "common.black",
					display: isAdmin ? "flex" : "none",
					flexDirection: "column",
					alignItems: "flex-start",
					textTransform: "none",
					p: 0,
					minWidth: "auto",
					"&:hover": {
						backgroundColor: "transparent",
					},
				}}
			>
				<Typography variant="caption" sx={{ lineHeight: 1 }}>
					Admin
				</Typography>
				<Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
					<Typography
						variant="body2"
						sx={{
							fontWeight: "bold",
							fontSize: "0.9rem",
							lineHeight: { xs: 1, md: isAuthenticated ? 0.5 : 1 },
						}}
					>
						Access
					</Typography>
					{isAuthenticated && (
						<Box
							onClick={handleMenuOpen}
							sx={{ cursor: "pointer", display: "flex", alignItems: "center" }}
						>
							<ArrowDropDownIcon fontSize="small" />
						</Box>
					)}
				</Box>
			</Button>
			<Menu
				anchorEl={anchorEl}
				open={Boolean(anchorEl)}
				onClose={handleMenuClose}
				anchorOrigin={{
					vertical: "top",
					horizontal: "center",
				}}
				transformOrigin={{
					vertical: "bottom",
					horizontal: "center",
				}}
				sx={{
					mt: 4,
				}}
			>
				<MenuItem onClick={handleRedirectToDashboard}>
					<Typography variant="body2" sx={{ fontSize: "0.75rem" }}>
						Dashboard
					</Typography>
				</MenuItem>
				<MenuItem onClick={handleRedirectToProducts}>
					<Typography variant="body2" sx={{ fontSize: "0.75rem" }}>
						Products
					</Typography>
				</MenuItem>
				<MenuItem onClick={handleRedirectToUsers}>
					<Typography variant="body2" sx={{ fontSize: "0.75rem" }}>
						Users
					</Typography>
				</MenuItem>
				<MenuItem onClick={handleRedirectToOrders}>
					<Typography variant="body2" sx={{ fontSize: "0.75rem" }}>
						Orders
					</Typography>
				</MenuItem>
				<MenuItem onClick={() => {}}>
					<Typography variant="body2" sx={{ fontSize: "0.75rem" }}>
						Support
					</Typography>
				</MenuItem>
			</Menu>
		</>
	);
};

function MainHeader() {
	const { cartItems } = useSelector(
		(state: { cart: { cartItems: any[] } }) => state.cart,
	);
	const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
	const [cartDrawerOpen, setCartDrawerOpen] = useState<boolean>(false);
	const [reqProductList] = useGetProductListMutation() as unknown as [
		() => Promise<void>,
	];
	const { isDarkMode, toggleTheme } = useThemeMode();
	const router = useRouter();
	const [cartItemsCount, setCartItemsCount] = useState<number>(0);
	const { xs } = useScreenSize();

	const toggleDrawer = () => {
		setDrawerOpen(!drawerOpen);
	};

	const toggleCartDrawer = () => {
		setCartDrawerOpen(!cartDrawerOpen);
	};

	const menuItems = ["Store", "Services"];

	useEffect(() => {
		reqProductList();
	}, [reqProductList]);

	useEffect(() => {
		const totalQuantity = cartItems.reduce(
			(acc, item) => acc + item.quantity,
			0,
		);
		setCartItemsCount(totalQuantity);
	}, [cartItems]);

	const handleNavigate = (route: string) => {
		router.push(`/${route}`);
	};

	const isActive = (item: string) => {
		return router.pathname.includes(item.toLowerCase());
	};

	return (
		<Box
			id="main-header"
			sx={{
				display: "flex",
				justifyContent: "space-between",
				alignItems: "center",
				backgroundColor: isDarkMode ? "common.black" : "common.white",
				boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
				padding: "4px",
				position: "fixed",
				top: 0,
				left: 0,
				right: 0,
				zIndex: 1000,
			}}
		>
			<Box
				sx={{
					position: "relative",
					padding: "1px",
					borderRadius: "5px",
					border: `1px solid transparent`,
					backgroundColor: isDarkMode ? "transparent" : "none",
					animation: isDarkMode ? "pulse 1.5s infinite" : "none",
					boxShadow: isDarkMode ? "0 0 5px gold, 0 0 10px gold" : "none",
				}}
				onClick={() => router.push("/store")}
			>
				<Image
					alt="main-logo"
					src={isDarkMode ? mainDarkLogo : mainLogo}
					width={xs ? 80 : 100}
					height={xs ? 30 : 40}
					priority
				/>
			</Box>
			<Box
				sx={{
					display: { xs: "none", sm: "flex" },
					flexGrow: 1,
					justifyContent: "center",
				}}
			>
				{menuItems.map((item) => (
					<Button
						key={item}
						sx={{
							mx: 1,
							backgroundColor: isActive(item)
								? "secondary.main"
								: "transparent",
							color: isActive(item)
								? "common.white"
								: isDarkMode
								? "common.white"
								: "common.black",
							"&:hover": {
								backgroundColor: isActive(item)
									? "secondary.main"
									: isDarkMode
									? "rgba(255, 255, 255, 0.1)"
									: "rgba(0, 0, 0, 0.1)",
							},
						}}
						onClick={() => handleNavigate(item.toLowerCase())}
					>
						{item}
					</Button>
				))}
			</Box>
			<Box sx={{ display: "flex", alignItems: "center" }}>
				<SignInButton isDarkMode={isDarkMode} />
				<AdminAccessButton isDarkMode={isDarkMode} />
				<IconButton onClick={toggleCartDrawer} sx={{ mr: 1 }}>
					<Badge badgeContent={cartItemsCount} color="secondary">
						<ShoppingCartIcon
							id="cart-icon"
							sx={{ color: isDarkMode ? "common.white" : "common.black" }}
						/>
					</Badge>
				</IconButton>
				<IconButton onClick={toggleTheme}>
					{isDarkMode ? (
						<WbSunnyIcon sx={{ color: "common.white" }} />
					) : (
						<NightsStayIcon sx={{ color: "common.black" }} />
					)}
				</IconButton>
				<IconButton
					onClick={toggleDrawer}
					sx={{ display: { xs: "flex", sm: "none" } }}
				>
					<MenuIcon
						sx={{ color: isDarkMode ? "common.white" : "common.black" }}
					/>
				</IconButton>
			</Box>
			<CartDrawer open={cartDrawerOpen} onClose={toggleCartDrawer} />
			<Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer}>
				<Box
					sx={{
						height: "100vh",
						width: 250,
						padding: 2,
						backgroundColor: isDarkMode ? "common.black" : "common.white",
					}}
				>
					{menuItems.map((item) => (
						<Button
							key={item}
							fullWidth
							onClick={() => {
								handleNavigate(item.toLowerCase());
								toggleDrawer();
							}}
							sx={{
								my: 1,
								backgroundColor: isActive(item)
									? "primary.main"
									: "transparent",
								color: isActive(item)
									? "common.white"
									: isDarkMode
									? "common.white"
									: "common.black",
								"&:hover": {
									backgroundColor: isActive(item)
										? "primary.main"
										: isDarkMode
										? "rgba(255, 255, 255, 0.1)"
										: "rgba(0, 0, 0, 0.1)",
								},
							}}
						>
							{item}
						</Button>
					))}
				</Box>
			</Drawer>
		</Box>
	);
}

export default MainHeader;
