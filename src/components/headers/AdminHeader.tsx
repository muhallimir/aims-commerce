import React from "react";
import {
	AppBar,
	Toolbar,
	Box,
	IconButton,
	Avatar,
	Typography,
} from "@mui/material";
import { Notifications, Logout } from "@mui/icons-material";
import useThemeMode from "src/hooks/useThemeMode";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import NightsStayIcon from "@mui/icons-material/NightsStay";
import useScreenSize from "src/hooks/useScreenSize";
import useAuthentication from "src/hooks/useAuthentication";
import { useSelector } from "react-redux";

const AdminHeader: React.FC<{ isSidebarOpen: boolean }> = ({
	isSidebarOpen,
}) => {
	const { isDarkMode, toggleTheme } = useThemeMode();
	const { handleSignOut } = useAuthentication();
	const { section } = useSelector(({ admin }: any) => admin);
	const { xs } = useScreenSize();
	const iconSize = xs ? 20 : 24;
	const manageSections = ["products", "users", "orders"];
	const isManagedSection = manageSections.includes(section);

	const displayedSection =
		isManagedSection && !xs ? `${section.slice(0, -1)} Management` : section;

	return (
		<AppBar
			position="fixed"
			sx={{
				zIndex: (theme) => theme.zIndex.drawer + 1,
				marginLeft: isSidebarOpen ? 220 : 64,
				width: `calc(100% - ${isSidebarOpen ? 220 : 64}px)`,
				backgroundColor: isDarkMode ? "common.black" : "common.white",
				transition: "transform 0.3s ease, width 0.3s ease",
				boxShadow: "none",
				borderBottom: `1px solid ${isDarkMode ? "none" : "rgba(0, 0, 0, 0.1)"}`,
			}}
		>
			<Toolbar
				sx={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
				}}
			>
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
					}}
				>
					<Typography
						variant="h4"
						color={isDarkMode ? "common.white" : "primary"}
						sx={{ textTransform: "capitalize" }}
					>
						{displayedSection}
					</Typography>
				</Box>
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						gap: 1,
						color: isDarkMode ? "common.white" : "common.black",
					}}
				>
					<IconButton onClick={toggleTheme} color="inherit">
						{isDarkMode ? (
							<NightsStayIcon sx={{ fontSize: iconSize }} />
						) : (
							<WbSunnyIcon sx={{ fontSize: iconSize }} />
						)}
					</IconButton>
					<IconButton color="inherit">
						<Notifications sx={{ fontSize: iconSize }} />
					</IconButton>
					<Avatar
						alt="Admin Avatar"
						src="https://via.placeholder.com/40"
						sx={{ width: 32, height: 32 }}
					/>
					<IconButton onClick={handleSignOut} color="inherit">
						<Logout sx={{ fontSize: iconSize }} />
					</IconButton>
				</Box>
			</Toolbar>
		</AppBar>
	);
};

export default AdminHeader;
