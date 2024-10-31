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
import { useSelector, useDispatch } from "react-redux";
import CloseIcon from "@mui/icons-material/Close";
import Image from "next/image";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import {
	decreaseItemQuantity,
	increaseItemQuantity,
	removeItemFromCart,
} from "@store/cart.slice";
import { useRouter } from "next/router";
import {
	CartDrawerProps,
	CartItem,
	Product,
	ProductListState,
} from "@common/interface";
import { setCurrentProduct } from "@store/products.slice";

const truncatedName = (name: string, maxLength: number) => {
	if (name.length > maxLength) {
		return name.substring(0, maxLength) + "...";
	}
	return name;
};

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
	const dispatch = useDispatch();
	const router = useRouter(); // Initialize useRouter
	const { cart }: { cart: CartItem[] } = useSelector(
		({ cartList }: { cartList: { cart: CartItem[] } }) => cartList,
	);
	const { products } = useSelector(
		(state: { productLists: ProductListState }) => state.productLists,
	);

	const totalPrice = cart.reduce(
		(total, item) => total + item.price * item.quantity,
		0,
	);

	const increaseQuantity = (itemId: string) => {
		dispatch(increaseItemQuantity(itemId));
	};

	const decreaseQuantity = (itemId: string) => {
		dispatch(decreaseItemQuantity(itemId));
	};

	const removeItem = (itemId: string) => {
		dispatch(removeItemFromCart(itemId));
	};

	const viewItem = (itemId: string) => {
		const currentProduct = products.find((p: Product) => p?._id === itemId);
		dispatch(setCurrentProduct(currentProduct));
		router.push(`/store/product/${itemId}`);
	};

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
				{cart.length === 0 ? (
					<Typography variant="body1" sx={{ textAlign: "center" }}>
						Your cart is empty.
					</Typography>
				) : (
					<Grid container spacing={2}>
						{cart.map((item) => (
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
											src={item.image}
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
				<Button variant="contained" color="primary" fullWidth sx={{ mb: 1 }}>
					View Cart
				</Button>
				<Button variant="contained" color="success" fullWidth sx={{ mb: 4 }}>
					Proceed to Checkout
				</Button>
			</Box>
		</Drawer>
	);
}
