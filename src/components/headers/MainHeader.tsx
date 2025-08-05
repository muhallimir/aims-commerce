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
	Chip,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
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
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import NightsStayIcon from "@mui/icons-material/NightsStay";
import PersonIcon from "@mui/icons-material/Person";
import LoginIcon from "@mui/icons-material/Login";
import useScreenSize from "src/hooks/useScreenSize";
import { switchSection } from "@store/admin.slice";
import { attractiveGlow, shimmer, orangeGlow } from "@common/animations";

const SignInButton: React.FC<SignInProps> = ({ isDarkMode }) => {
	const {
		userInfo,
		isAuthenticated,
		handleSignIn,
		handleSignOut,
		isAdmin,
		isSeller,
	} = useAuthentication();
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

	const handleSellerDashboard = () => {
		handleMenuClose();
		router.push("/seller/dashboard");
	};

	const handleLogout = () => {
		handleSignOut();
		handleMenuClose();
	};

	const handleStartSelling = () => {
		handleMenuClose();
		router.push("/start-selling");
	};


	return (
		<>
			{!isAuthenticated ? (
				<Button
					variant="contained"
					color="success"
					onClick={handleSignIn}
					startIcon={<LoginIcon />}
					sx={{
						ml: 2,
						textTransform: "none",
						borderRadius: 3,
						px: 2,
						py: 1,
						fontWeight: 600,
						position: "relative",
						overflow: "hidden",
						animation: `${attractiveGlow} 2.5s ease-in-out infinite`,
						background: "linear-gradient(45deg, #4CAF50 30%, #66BB6A 90%)",
						"&:hover": {
							animation: "none",
							transform: "scale(1.05)",
							boxShadow: "0 4px 20px rgba(76, 175, 80, 0.4)",
							background: "linear-gradient(45deg, #43A047 30%, #4CAF50 90%)",
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
					<Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
						<Typography variant="caption" sx={{ lineHeight: 1, color: "inherit" }}>
							Try Demo!
						</Typography>
						<Typography variant="body2" sx={{ fontWeight: "bold", fontSize: "0.9rem", color: "inherit" }}>
							Sign In
						</Typography>
					</Box>
				</Button>
			) : (
				<Box sx={{ ml: 2, display: "flex", alignItems: "center", gap: 1 }}>
					<Chip
						avatar={<PersonIcon sx={{ fontSize: "1rem" }} />}
						label={
							<Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", py: 0.5 }}>
								<Typography variant="caption" sx={{ lineHeight: 1, fontSize: "0.7rem" }}>
									Welcome,
								</Typography>
								<Typography
									variant="body2"
									sx={{
										fontWeight: "bold",
										fontSize: "0.8rem",
										lineHeight: 1.2,
										maxWidth: { xs: "80px", sm: "120px", md: "150px" },
										overflow: "hidden",
										textOverflow: "ellipsis",
										whiteSpace: "nowrap"
									}}
									title={userInfo?.name}
								>
									{userInfo?.name}
								</Typography>
							</Box>
						}
						sx={{
							height: "auto",
							py: 0.5,
							px: 1,
							backgroundColor: isDarkMode ? "grey.800" : "grey.100",
							color: isDarkMode ? "common.white" : "common.black",
							border: `1px solid ${isDarkMode ? "grey.600" : "grey.300"}`,
							"& .MuiChip-avatar": {
								width: 20,
								height: 20,
								fontSize: "0.8rem",
								color: "primary.main",
							},
							"& .MuiChip-label": {
								px: 1,
							}
						}}
					/>
					<IconButton
						size="small"
						onClick={handleMenuOpen}
						sx={{
							color: isDarkMode ? "common.white" : "common.black",
							"&:hover": {
								backgroundColor: isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
							},
						}}
					>
						<ArrowDropDownIcon fontSize="small" />
					</IconButton>
				</Box>
			)}
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
				PaperProps={{
					sx: {
						mt: 1,
						borderRadius: 2,
						boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
						border: isDarkMode ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.1)",
					}
				}}
			>
				<MenuItem
					onClick={handleRedirectToProfile}
					sx={{
						py: 1.5,
						px: 2,
						borderRadius: 1,
						mx: 0.5,
						mb: 0.5,
						"&:hover": {
							backgroundColor: "primary.light",
							color: "primary.contrastText",
						},
					}}
				>
					<Typography variant="body2" sx={{ fontSize: "0.85rem", fontWeight: 500 }}>
						Profile
					</Typography>
				</MenuItem>
				<MenuItem
					onClick={redirectToPurchases}
					sx={{
						py: 1.5,
						px: 2,
						borderRadius: 1,
						mx: 0.5,
						mb: 0.5,
						"&:hover": {
							backgroundColor: "primary.light",
							color: "primary.contrastText",
						},
					}}
				>
					<Typography variant="body2" sx={{ fontSize: "0.85rem", fontWeight: 500 }}>
						Purchases
					</Typography>
				</MenuItem>
				{isAuthenticated && isSeller && (
					<MenuItem
						onClick={handleSellerDashboard}
						sx={{
							py: 1.5,
							px: 2,
							borderRadius: 1,
							mx: 0.5,
							mb: 0.5,
							"&:hover": {
								backgroundColor: "secondary.light",
								color: "secondary.contrastText",
							},
						}}
					>
						<Typography variant="body2" sx={{ fontSize: "0.85rem", fontWeight: 500 }}>
							Seller Dashboard
						</Typography>
					</MenuItem>
				)}
				{isAuthenticated && !isAdmin && !isSeller && (
					<MenuItem
						onClick={handleStartSelling}
						sx={{
							py: 1.5,
							px: 2,
							borderRadius: 1,
							mx: 0.5,
							mb: 0.5,
							"&:hover": {
								backgroundColor: "success.light",
								color: "success.contrastText",
							},
						}}
					>
						<Typography variant="body2" sx={{ fontSize: "0.85rem", fontWeight: 500 }}>
							Start Selling
						</Typography>
					</MenuItem>
				)}
				<MenuItem
					onClick={handleLogout}
					sx={{
						py: 1.5,
						px: 2,
						borderRadius: 1,
						mx: 0.5,
						mb: 0.5,
						borderTop: "1px solid",
						borderColor: "divider",
						mt: 0.5,
						"&:hover": {
							backgroundColor: "error.light",
							color: "error.contrastText",
						},
					}}
				>
					<Typography variant="body2" sx={{ fontSize: "0.85rem", fontWeight: 500 }}>
						Logout
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
	const { isAdmin, isSeller, isAuthenticated } = useAuthentication();
	const isAdminView = router.pathname.includes("/admin");
	const dispatch = useDispatch();

	const toggleDrawer = () => {
		setDrawerOpen(!drawerOpen);
	};

	const toggleCartDrawer = () => {
		setCartDrawerOpen(!cartDrawerOpen);
	};

	const getMenuItems = () => {
		const items = ["Store", "Services"];
		if (isSeller) items.push("Seller");
		if (isAdmin) items.push("Admin");
		if (isAuthenticated && !isAdmin && !isSeller) items.push("Start Selling");
		return items;
	};

	const menuItems = getMenuItems();

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
		if (route === "seller") {
			router.push("/seller/dashboard");
		} else if (route === "start selling") {
			router.push("/start-selling");
		} else {
			dispatch(switchSection("dashboard"));
			router.push(`/${route}`);
		}
	};

	const isActive = (item: string) => {
		if (item.toLowerCase() === "seller") {
			return router.pathname.includes("/seller");
		}
		if (item.toLowerCase() === "start selling") {
			return router.pathname === "/start-selling";
		}
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
			{!isAdminView && (
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
						style={{ marginTop: "8px" }}
					/>
				</Box>
			)}
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
							...(item === "Start Selling" && !isActive(item) && {
								position: "relative",
								overflow: "hidden",
								background: "linear-gradient(45deg, #FF9800 30%, #FFB74D 90%)",
								color: "common.white",
								fontWeight: 600,
								animation: `${orangeGlow} 3s ease-in-out infinite`,
								"&::before": {
									content: '""',
									position: "absolute",
									top: 0,
									left: "-100%",
									width: "100%",
									height: "100%",
									background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
									animation: `${shimmer} 4s ease-in-out infinite`,
								},
							}),
							"&:hover": {
								backgroundColor: isActive(item)
									? "secondary.main"
									: item === "Start Selling"
										? "linear-gradient(45deg, #F57C00 30%, #FF9800 90%)"
										: isDarkMode
											? "rgba(255, 255, 255, 0.1)"
											: "rgba(0, 0, 0, 0.1)",
								...(item === "Start Selling" && {
									animation: "none",
									transform: "scale(1.05)",
									boxShadow: "0 4px 20px rgba(255, 152, 0, 0.4)",
								}),
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
				<IconButton
					onClick={toggleCartDrawer}
					sx={{ mr: 1 }}
				>
					<Badge
						badgeContent={cartItemsCount}
						color="secondary"
						sx={{
							...(cartItemsCount > 0 && {
								"& .MuiBadge-badge": {
									fontSize: "0.65rem",
									minWidth: "18px",
									height: "18px",
									padding: "0 4px",
								},
							}),
						}}
					>
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
								...(item === "Start Selling" && !isActive(item) && {
									position: "relative",
									overflow: "hidden",
									background: "linear-gradient(45deg, #FF9800 30%, #FFB74D 90%)",
									color: "common.white",
									fontWeight: 600,
									borderRadius: 2,
									animation: `${orangeGlow} 3s ease-in-out infinite`,
									"&::before": {
										content: '""',
										position: "absolute",
										top: 0,
										left: "-100%",
										width: "100%",
										height: "100%",
										background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
										animation: `${shimmer} 4s ease-in-out infinite`,
									},
								}),
								"&:hover": {
									backgroundColor: isActive(item)
										? "primary.main"
										: item === "Start Selling"
											? "linear-gradient(45deg, #F57C00 30%, #FF9800 90%)"
											: isDarkMode
												? "rgba(255, 255, 255, 0.1)"
												: "rgba(0, 0, 0, 0.1)",
									...(item === "Start Selling" && {
										animation: "none",
										transform: "scale(1.02)",
										boxShadow: "0 4px 15px rgba(255, 152, 0, 0.4)",
									}),
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
