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
import CloseIcon from "@mui/icons-material/Close";
import Image from "next/image";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { CartDrawerProps } from "@common/interface";
import useCartHandling from "src/hooks/useCartHandling";
import { getImageUrl } from "@helpers/commonFn";

const truncatedName = (name: string, maxLength: number) => {
	if (name.length > maxLength) {
		return name.substring(0, maxLength) + "...";
	}
	return name;
};

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
	const {
		cartItems,
		increaseQuantity,
		decreaseQuantity,
		removeItem,
		viewItem,
		viewCartPage,
		totalPrice,
		proceedToCheckout,
	} = useCartHandling(onClose);

	return (
		<Drawer anchor="right" open={open} onClose={onClose}>
			<Box
				sx={{
					width: {
						xs: 300,
						sm: 350,
						lg: 370,
					},
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
				{cartItems.length === 0 ? (
					<Typography variant="body1" sx={{ textAlign: "center" }}>
						Your cart is empty.
					</Typography>
				) : (
					<Grid container spacing={2}>
						{cartItems.map((item) => (
							<Grid item xs={12} key={item._id}>
								<Box
									sx={{
										display: "flex",
										alignItems: "center",
										mb: 1,
										border: "1px solid #e0e0e0",
										borderRadius: "4px",
										padding: 1,
										justifyContent: "space-between",
									}}
								>
									<Box
										sx={{
											display: "flex",
											flexDirection: "column",
											alignItems: "center",
											justifyContent: "center",
											mt: 1.5,
											mr: 0.2,
										}}
									>
										<Image
											src={getImageUrl(item.image)}
											alt={item.name}
											width={55}
											height={50}
											style={{ borderRadius: "4px" }}
										/>
										<IconButton onClick={() => viewItem(item._id)}>
											<Typography variant="body2" color="primary">
												View Item
											</Typography>
										</IconButton>
									</Box>

									<Box sx={{ flexGrow: 1 }}>
										<Typography variant="body2">
											{truncatedName(item.name, 20)}
										</Typography>
										<Box sx={{ display: "flex", alignItems: "center" }}>
											<IconButton
												onClick={() =>
													item.quantity === 1
														? removeItem(item._id)
														: decreaseQuantity(item._id)
												}
											>
												<RemoveIcon />
											</IconButton>
											<Typography variant="body2" sx={{ mx: 1 }}>
												{item.quantity}
											</Typography>
											<IconButton onClick={() => increaseQuantity(item._id)}>
												<AddIcon />
											</IconButton>
										</Box>
										<Typography variant="body2" color="text.secondary">
											Price: ${item.price.toFixed(2)}
										</Typography>
									</Box>
									<IconButton onClick={() => removeItem(item._id)}>
										<DeleteIcon color="error" />
									</IconButton>
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
				<Button
					variant="contained"
					color="primary"
					fullWidth
					sx={{ mb: 1 }}
					onClick={viewCartPage}
				>
					View Cart
				</Button>
				<Button
					variant="contained"
					color="success"
					fullWidth
					sx={{ mb: 4 }}
					onClick={() => proceedToCheckout()}
				>
					Proceed to Checkout
				</Button>
			</Box>
		</Drawer>
	);
}
