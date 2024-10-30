import React, { useEffect, useState } from "react";
import {
	Box,
	Typography,
	Switch,
	Button,
	IconButton,
	Drawer,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { switchTheme } from "@store/app.slice";
import Image from "next/image";
import mainLogo from "@public/assets/aims-logo.png";
import mainDarkLogo from "@public/assets/aims-logo-dark.png";
import MenuIcon from "@mui/icons-material/Menu";
import { useGetProductListMutation } from "@store/products.slice";
import { useRouter } from "next/router";

function MainHeader() {
	const { theme: mode } = useSelector(({ app }) => app);
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [reqProductList] = useGetProductListMutation();
	const dispatch = useDispatch();
	const darkMode = mode === "dark";
	const router = useRouter();

	const toggleTheme = () => {
		dispatch(switchTheme(darkMode ? "light" : "dark"));
	};

	const toggleDrawer = () => {
		setDrawerOpen(!drawerOpen);
	};

	const menuItems = ["Home", "Products", "Store", "Services"];

	useEffect(() => {
		reqProductList();
	}, [reqProductList]);

	const handleNavigate = (route) => {
		router.push(`/${route}`);
	};

	return (
		<Box
			sx={{
				display: "flex",
				justifyContent: "space-between",
				alignItems: "center",
				backgroundColor: darkMode ? "common.black" : "common.white",
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
					backgroundColor: darkMode ? "transparent" : "none",
					animation: darkMode ? "pulse 1.5s infinite" : "none",
					boxShadow: darkMode ? "0 0 5px gold, 0 0 10px gold" : "none",
				}}
				onClick={() => router.push("/home")}
			>
				<Image
					alt="main-logo"
					src={darkMode ? mainDarkLogo : mainLogo}
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
							color: darkMode ? "common.white" : "common.black",
							mx: 1,
						}}
						onClick={() => handleNavigate(item.toLowerCase())}
					>
						{item}
					</Button>
				))}
			</Box>
			<Box sx={{ display: "flex", alignItems: "center" }}>
				<Typography
					variant="body2"
					sx={{
						marginRight: "1rem",
						color: darkMode ? "common.white" : "common.black",
					}}
				>
					{darkMode ? "Dark" : "Light"} Mode
				</Typography>
				<Switch checked={darkMode} onChange={toggleTheme} color="primary" />
				<IconButton
					onClick={toggleDrawer}
					sx={{ display: { xs: "flex", sm: "none" } }}
				>
					<MenuIcon
						sx={{ color: darkMode ? "common.white" : "common.black" }}
					/>
				</IconButton>
			</Box>
			<Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer}>
				<Box
					sx={{
						height: "100vh",
						width: 250,
						padding: 2,
						backgroundColor: darkMode ? "common.black" : "common.white",
					}}
				>
					{menuItems.map((item) => (
						<Button
							key={item}
							fullWidth
							onClick={toggleDrawer}
							sx={{
								color: darkMode ? "common.white" : "common.black",
								my: 1,
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
