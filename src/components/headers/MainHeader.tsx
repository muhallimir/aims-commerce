import React, { useEffect, useState } from "react";
import {
	Box,
	Typography,
	Switch,
	Button,
	IconButton,
	Drawer,
	Badge,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { switchTheme } from "@store/app.slice";
import Image from "next/image";
import mainLogo from "@public/assets/aims-logo.png";
import mainDarkLogo from "@public/assets/aims-logo-dark.png";
import MenuIcon from "@mui/icons-material/Menu";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CloseIcon from "@mui/icons-material/Close";
import { useGetProductListMutation } from "@store/products.slice";
import { useRouter } from "next/router";
import CartDrawer from "../drawers/CartDrawer";
import useThemeMode from "src/hooks/useThemeMode";
import { SignInProps } from "@common/interface";

const SignIn: React.FC<SignInProps> = ({ router, isDarkMode }) => {
	return (
		<Button
			variant="contained"
			onClick={() => router.push("/signin")}
			sx={{
				ml: 2,
				backgroundColor: isDarkMode ? "primary.main" : "secondary.main",
				color: "common.white",
				borderRadius: "20px",
				boxShadow: `0px 4px 6px ${
					isDarkMode ? "rgba(0, 0, 0, 0.3)" : "rgba(255, 255, 255, 0.3)"
				}`,
				transition: "background-color 0.3s ease, transform 0.3s ease",
				"&:hover": {
					backgroundColor: isDarkMode ? "primary.dark" : "secondary.dark",
					transform: "scale(1.05)",
				},
			}}
		>
			Sign In
		</Button>
	);
};

function MainHeader() {
	const { cart } = useSelector(
		(state: { cartList: { cart: any[] } }) => state.cartList,
	);
	const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
	const [cartDrawerOpen, setCartDrawerOpen] = useState<boolean>(false);
	const [reqProductList] = useGetProductListMutation() as unknown as [
		() => Promise<void>,
	];
	const { isDarkMode, toggleTheme } = useThemeMode();
	const router = useRouter();
	const [cartItemsCount, setCartItemsCount] = useState<number>(0);

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
		const totalQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);
		setCartItemsCount(totalQuantity);
	}, [cart]);

	const handleNavigate = (route: string) => {
		router.push(`/${route}`);
	};

	const isActive = (item: string) => {
		return router.pathname.includes(item.toLowerCase());
	};

	return (
		<Box
			sx={{
				display: "flex",
				justifyContent: "space-between",
				alignItems: "center",
				backgroundColor: isDarkMode ? "common.black" : "common.white",
				boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
				padding: "4px",
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
					width={100}
					height={40}
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
				<IconButton
					onClick={toggleDrawer}
					sx={{ display: { xs: "flex", sm: "none" } }}
				>
					<MenuIcon
						sx={{ color: isDarkMode ? "common.white" : "common.black" }}
					/>
				</IconButton>
				<IconButton onClick={toggleCartDrawer} sx={{ mr: 1 }}>
					<Badge badgeContent={cartItemsCount} color="secondary">
						<ShoppingCartIcon
							sx={{ color: isDarkMode ? "common.white" : "common.black" }}
						/>
					</Badge>
				</IconButton>
				<Typography
					variant="body2"
					sx={{
						marginRight: "1rem",
						color: isDarkMode ? "common.white" : "common.black",
						display: { xs: "none", sm: "flex" },
					}}
				>
					{isDarkMode ? "Dark" : "Light"} Mode
				</Typography>
				<Switch
					checked={isDarkMode}
					onChange={toggleTheme}
					color="primary"
					sx={{ display: { xs: "none", sm: "flex" } }}
				/>

				<SignIn router={router} isDarkMode={isDarkMode} />
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
					<Box
						sx={{
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
						}}
					>
						<Typography
							variant="body2"
							sx={{ color: isDarkMode ? "common.white" : "common.black" }}
						>
							{isDarkMode ? "Dark" : "Light"} Mode
						</Typography>
						<Switch
							checked={isDarkMode}
							onChange={toggleTheme}
							color="primary"
						/>
						<IconButton onClick={toggleDrawer}>
							<CloseIcon
								sx={{ color: isDarkMode ? "common.white" : "common.black" }}
							/>
						</IconButton>
					</Box>
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
										? "primary.dark"
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
			<style jsx>{`
				@keyframes pulse {
					0% {
						transform: scale(1);
						box-shadow: 0 0 5px gold, 0 0 10px gold;
					}
					50% {
						transform: scale(1.05);
						box-shadow: 0 0 10px gold, 0 0 20px gold;
					}
					100% {
						transform: scale(1);
						box-shadow: 0 0 5px gold, 0 0 10px gold;
					}
				}
			`}</style>
		</Box>
	);
}

export default MainHeader;
