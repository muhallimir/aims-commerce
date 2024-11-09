import React from "react";
import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Button,
	Box,
	Fade,
} from "@mui/material";
import { ConfirmModalProps } from "@common/interface";

const ConfirmModal: React.FC<ConfirmModalProps> = ({
	open,
	onClose,
	onConfirm,
	message,
}) => {
	return (
		<Dialog open={open} onClose={onClose} sx={{ backdropFilter: "blur(5px)" }}>
			<Fade in={open}>
				<Box
					sx={{
						bgcolor: "rgba(255, 255, 255, 0.9)",
						p: 3,
						borderRadius: 2,
						boxShadow: 3,
					}}
				>
					<DialogTitle sx={{ textAlign: "center" }}>Confirm Action</DialogTitle>
					<DialogContent sx={{ textAlign: "center", mb: 2 }}>
						<Box sx={{ color: "text.secondary" }}>{message}</Box>
					</DialogContent>
					<DialogActions sx={{ justifyContent: "center" }}>
						<Button onClick={onClose} variant="outlined" color="secondary">
							Cancel
						</Button>
						<Button
							onClick={() => {
								onConfirm();
								onClose();
							}}
							variant="contained"
							color="primary"
							sx={{ ml: 1 }}
						>
							Confirm
						</Button>
					</DialogActions>
				</Box>
			</Fade>
		</Dialog>
	);
};

export default ConfirmModal;
