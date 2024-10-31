import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useRouter } from "next/router";

const ComingSoon = () => {
	const router = useRouter();

	const handleGoHome = () => {
		router.push("/store");
	};

	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				height: "100vh",
				backgroundColor: "common.white",
				textAlign: "center",
				padding: 2,
				boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
			}}
		>
			<Typography variant="h3" sx={{ mb: 2, color: "primary.main" }}>
				🌟 Coming Soon!
			</Typography>
			<Typography variant="h5" sx={{ mb: 4, color: "text.secondary" }}>
				This page is currently under construction. Stay tuned for updates!
			</Typography>
			<Button
				variant="contained"
				color="primary"
				onClick={handleGoHome}
				sx={{
					padding: "10px 20px",
					borderRadius: "5px",
					fontSize: "16px",
					"&:hover": {
						backgroundColor: "primary.dark",
					},
				}}
			>
				Go Back TO STORE
			</Button>
		</Box>
	);
};

export default ComingSoon;
