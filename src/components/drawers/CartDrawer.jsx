import React from "react";
import {
	Box,
	Typography,
	Button,
	IconButton,
	Drawer,
	Divider,
	Grid,
} from "@mui/material";
import { useSelector } from "react-redux";
import CloseIcon from "@mui/icons-material/Close";
import Image from "next/image";

export default function CartDrawer({ open, onClose }) {
	const { cart } = useSelector(({ cartList }) => cartList);

	// Calculate total price
	const totalPrice = cart.reduce(
		(total, item) => total + item.price * item.quantity,
		0,
	);

	return (
		<Drawer anchor="right" open={open} onClose={onClose}>
			<Box
				sx={{
					width: 300,
					padding: 2,
					backgroundColor: "background.paper",
					height: "100vh",
				}}
			>
				<Box
					sx={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
					}}
				>
					<Typography variant="h6">Shopping Cart</Typography>
					<IconButton onClick={onClose}>
						<CloseIcon />
					</IconButton>
				</Box>
				<Divider sx={{ my: 2 }} />
				{cart.length === 0 ? (
					<Typography variant="body1" sx={{ textAlign: "center" }}>
						Your cart is empty.
					</Typography>
				) : (
					<Grid container spacing={2}>
						{cart.map((item) => (
							<Grid item xs={12} key={item.id}>
								<Box
									sx={{
										display: "flex",
										alignItems: "center",
										mb: 1,
										border: "1px solid #e0e0e0",
										borderRadius: "4px",
										padding: 1,
									}}
								>
									<Image
										src={item.image}
										alt={item.title}
										width={50}
										height={50}
										style={{ borderRadius: "4px", marginRight: 8 }}
									/>
									<Box sx={{ flexGrow: 1 }}>
										<Typography variant="body2">{item.title}</Typography>
										<Typography variant="body2" color="text.secondary">
											Qty: {item.quantity} | Price: ${item.price.toFixed(2)}
										</Typography>
									</Box>
								</Box>
							</Grid>
						))}
					</Grid>
				)}
				<Divider sx={{ my: 2 }} />
				<Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
					<Typography variant="h6">Total:</Typography>
					<Typography variant="h6">${totalPrice.toFixed(2)}</Typography>
				</Box>
				<Button variant="contained" color="primary" fullWidth sx={{ mb: 1 }}>
					View Cart
				</Button>
				<Button variant="contained" color="success" fullWidth>
					Proceed to Checkout
				</Button>
			</Box>
		</Drawer>
	);
}
