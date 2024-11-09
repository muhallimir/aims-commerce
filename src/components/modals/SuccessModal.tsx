import React from "react";
import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Button,
	Typography,
	Box,
} from "@mui/material";
import { useRouter } from "next/router";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { SuccessModalProps } from "@common/interface";

const SuccessModal: React.FC<SuccessModalProps> = ({
	open,
	onClose,
	title,
	subTitle,
}) => {
	const router = useRouter();

	const handleGoToStore = () => {
		router.push("/store");
		onClose();
	};

	return (
		<Dialog
			open={open}
			onClose={onClose}
			maxWidth="sm"
			fullWidth
			sx={{
				"& .MuiDialogTitle-root": {
					backgroundColor: "primary.aims.main",
					color: "common.white",
					padding: "24px",
					textAlign: "center",
					fontWeight: "600",
					fontSize: "1.5rem",
				},
				"& .MuiDialogContent-root": {
					padding: "32px",
					borderRadius: "0 0 16px 16px",
				},
				"& .MuiDialogActions-root": {
					padding: "16px 24px",
					justifyContent: "center",
				},
			}}
		>
			<DialogTitle>
				<Typography variant="body2" color="primary" sx={{ fontWeight: 700 }}>
					{title}
				</Typography>
			</DialogTitle>

			<DialogContent>
				<Box
					display="flex"
					flexDirection="column"
					alignItems="center"
					justifyContent="center"
					sx={{
						borderRadius: "12px",
						boxShadow: `0 8px 16px ${"common.black"}`,
						backgroundColor: "common.white",
					}}
				>
					<Typography
						variant="body2"
						color="text.black"
						sx={{
							mb: 3,
							fontSize: "18px",
							textAlign: "center",
							maxWidth: "90%",
							fontWeight: 500,
						}}
					>
						{subTitle}
					</Typography>
				</Box>
			</DialogContent>

			<DialogActions>
				<Box
					display="flex"
					flexDirection="column"
					gap={2}
					width="100%"
					sx={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
					}}
				>
					<Button
						variant="contained"
						startIcon={<ShoppingCartIcon />}
						sx={{
							width: "100%",
							fontWeight: "bold",
							borderRadius: "50px",
							backgroundColor: "primary.aims.main",
							padding: "12px 20px",
							textTransform: "none",
							boxShadow: `0 6px 12px ${"common.black"}`,
							"&:hover": {
								backgroundColor: "primary.aims.dark",
							},
						}}
						onClick={handleGoToStore}
					>
						Go to Store
					</Button>
					<Button
						onClick={onClose}
						variant="outlined"
						color="primary"
						sx={{
							width: "100%",
							fontWeight: "bold",
							borderRadius: "50px",
							padding: "12px 20px",
							textTransform: "none",
							borderColor: "primary.aims.main",
							color: "primary.aims.main",
							"&:hover": {
								backgroundColor: "primary.aims.main",
								color: "primary.dark",
							},
						}}
					>
						Close
					</Button>
				</Box>
			</DialogActions>
		</Dialog>
	);
};

export default SuccessModal;
