import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import mainLogo from "@public/assets/aims-logo.png";
import mainDarkLogo from "@public/assets/aims-logo-dark.png";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import Image from "next/image";
import useThemeMode from "src/hooks/useThemeMode";

const Footer: React.FC = () => {
	const { isDarkMode } = useThemeMode();

	const handleLogoClick = () => {
		const topElement = document.getElementById("main-header");
		if (topElement) {
			topElement.scrollIntoView({ behavior: "smooth" });
		}
	};

	return (
		<Box
			sx={{
				backgroundColor: isDarkMode ? "common.black" : "primary.dark",
				padding: 3,
				borderTop: isDarkMode ? "5px solid gold" : "none",
			}}
		>
			<Box
				sx={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					mt: 2,
					flexDirection: "column",
					textAlign: "center",
					color: "white",
				}}
			>
				<Box
					onClick={handleLogoClick}
					sx={{
						position: "relative",
						padding: "1px",
						borderRadius: "5px",
						animation: isDarkMode ? "pulse 1.5s infinite" : "none",
						cursor: "pointer",
						bgcolor: isDarkMode ? "common.black" : "common.white",
					}}
				>
					<Image
						alt="main-logo"
						src={isDarkMode ? mainDarkLogo : mainLogo}
						width={100}
						height={40}
						priority
						style={{ marginTop: "8px" }}
					/>
				</Box>

				<Box sx={{ mt: 1 }}>
					<Typography variant="body2" sx={{ mt: 1 }}>
						AIMS-COMMERCE 2024. All rights reserved™
					</Typography>
					<IconButton
						component="a"
						href="/"
						target="_blank"
						aria-label="Facebook"
					>
						<FacebookIcon sx={{ color: "white" }} />
					</IconButton>
					<IconButton
						component="a"
						href="/"
						target="_blank"
						aria-label="Twitter"
					>
						<TwitterIcon sx={{ color: "white" }} />
					</IconButton>
					<IconButton
						component="a"
						href="/"
						target="_blank"
						aria-label="Instagram"
					>
						<InstagramIcon sx={{ color: "white" }} />
					</IconButton>
					<IconButton
						component="a"
						href="/"
						target="_blank"
						aria-label="YouTube"
					>
						<YouTubeIcon sx={{ color: "white" }} />
					</IconButton>
				</Box>
			</Box>

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
};

export default Footer;
