import React from "react";
import { Box, Stack } from "@mui/material";
import useThemeMode from "src/hooks/useThemeMode";

const AdminDashboardSection: React.FC<{
	children: React.ReactNode;
	isSidebarOpen: boolean;
}> = ({ children, isSidebarOpen }) => {
	const { isDarkMode } = useThemeMode();

	return (
		<Box
			sx={{
				flexGrow: 1,
				overflow: "auto",
				padding: "80px 40px",
				height: "100%",
				minHeight: "100vh",
				width: `calc(100% - ${isSidebarOpen ? 220 : 64}px)`,
				backgroundColor: isDarkMode ? "common.black" : "common.white",
				transition: "transform 0.3s ease, width 0.3s ease",
			}}
		>
			<Stack>{children}</Stack>
		</Box>
	);
};

export default AdminDashboardSection;
