import { Typography, Box, useTheme } from "@mui/material";
import { keyframes } from "@emotion/react";
import { LoadingOverLayProps } from "@common/interface";

const LoadingOverlay: React.FC<LoadingOverLayProps> = ({
	variant,
	loadingMessage,
}) => {
	const theme = useTheme();
	const bounce = keyframes`0%, 100% { transform: translateY(0); }  50% { transform: translateY(-10px); }`;
	const gradientShift = keyframes`0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; }`;

	return (
		<Box
			sx={{
				position: "fixed",
				top: 0,
				left: 0,
				width: "100vw",
				height: "100vh",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				zIndex: 9999,
				backgroundColor: variant === "transparent" ? "" : "background.modal",
			}}
		>
			<Typography
				variant="h6"
				sx={{
					textAlign: "center",
					mx: 2,
					background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main}, ${theme.palette.primary.light})`,
					backgroundSize: "200% 200%",
					backgroundClip: "text",
					WebkitBackgroundClip: "text",
					color: "transparent",
					fontSize: "1.2rem",
					fontWeight: "medium",
					mb: 2,
					animation: `${gradientShift} 4s ease infinite`,
				}}
			>
				{loadingMessage}
			</Typography>
			<Box sx={{ display: "flex", gap: "5px" }}>
				{Array.from({ length: 3 }).map((_, i) => (
					<Box
						key={i}
						sx={{
							width: 8,
							height: 8,
							borderRadius: "50%",
							backgroundColor: theme.palette.secondary.main,
							animation: `${bounce} 0.6s ${i * 0.1}s infinite ease-in-out`,
						}}
					/>
				))}
			</Box>
		</Box>
	);
};

export default LoadingOverlay;
