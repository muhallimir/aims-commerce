import React from "react";
import {
	Box,
	Typography,
	Button,
	Divider,
	Container,
	Grid,
	IconButton,
} from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import Image from "next/image";
import useScreenSize from "src/hooks/useScreenSize";
import useCartHandling from "src/hooks/useCartHandling";
import useThemeMode from "src/hooks/useThemeMode";
import PurchaseProgressBar from "src/components/bars/PurchaseProgressBar";
import { CartItem } from "@common/interface";

const CartPageLayout: React.FC = () => {
	const { xs } = useScreenSize();
	const {
		cartItems,
		increaseQuantity,
		decreaseQuantity,
		removeItem,
		viewItem,
		totalPrice,
		proceedToCheckout,
	} = useCartHandling();
	const { isDarkMode } = useThemeMode();

	return (
		<>
			<PurchaseProgressBar activeStep={0} />
			<Container
				maxWidth="lg"
				sx={{
					padding: 4,
					minHeight: "100vh",
				}}
			>
				<Typography
					variant="h4"
					gutterBottom
					sx={{
						...(!isDarkMode && { color: "var(--color-text-secondary)" }),
					}}
				>
					Shopping Cart
				</Typography>
				<Divider sx={{ mb: 2 }} />
				{cartItems.length === 0 ? (
					<Typography variant="body1" sx={{ textAlign: "center" }}>
						Your cart is empty.
					</Typography>
				) : (
					<Grid container spacing={2}>
						<Grid item xs={12} md={8}>
							<Box>
								{cartItems.map((item: CartItem) => (
									<Box
										key={item._id}
										sx={{
											display: "flex",
											alignItems: "center",
											border: "1px solid var(--background-dark)",
											borderRadius: "8px",
											padding: 2,
											mb: 2,
											transition: "0.3s",
											"&:hover": {
												boxShadow: 3,
											},
										}}
									>
										<Image
											src={item.image}
											alt={item.name}
											width={100}
											height={100}
											style={{
												borderRadius: "8px",
												marginRight: 16,
												objectFit: "contain",
											}}
											onClick={() => viewItem(item._id)}
										/>
										<Box sx={{ flexGrow: 1, color: "primary.main" }}>
											<Typography variant={xs ? "body1" : "h5"}>
												{item.name.length > 15
													? `${item.name.slice(0, xs ? 15 : 50)}...`
													: item.name}
											</Typography>
											{xs ? (
												<Typography variant="body2" color="text.secondary">
													Price: ${item.price.toFixed(2)}
												</Typography>
											) : (
												<Typography variant="body2" color="text.secondary">
													Price: ${item.price.toFixed(2)} × {item.quantity}
												</Typography>
											)}
											<Typography variant="body2">
												Total: ${(item.price * item.quantity).toFixed(2)}
											</Typography>
											{xs ? (
												<Box
													sx={{
														display: "flex",
														alignItems: "center",
														justifyContent: "center",
													}}
												>
													<IconButton
														onClick={() =>
															item.quantity === 1
																? removeItem(item._id)
																: decreaseQuantity(item._id)
														}
														sx={{
															...(isDarkMode && { color: "common.white" }),
														}}
													>
														<RemoveIcon />
													</IconButton>
													<Typography variant="body2" sx={{ mx: 1 }}>
														{item.quantity}
													</Typography>
													<IconButton
														onClick={() => increaseQuantity(item._id)}
														sx={{
															...(isDarkMode && { color: "common.white" }),
														}}
													>
														<AddIcon />
													</IconButton>
												</Box>
											) : (
												<>
													<Button
														variant="contained"
														color="secondary"
														size="small"
														onClick={() => decreaseQuantity(item._id)}
														sx={{ mx: 1 }}
													>
														-
													</Button>
													<Button
														variant="contained"
														color="primary"
														size="small"
														onClick={() => increaseQuantity(item._id)}
													>
														+
													</Button>
												</>
											)}
										</Box>
										<Button
											variant="contained"
											color="error"
											size="small"
											onClick={() => removeItem(item._id)}
										>
											Remove
										</Button>
									</Box>
								))}
							</Box>
						</Grid>
						<Grid item xs={12} md={4}>
							<Box
								sx={{
									padding: 2,
									border: "1px solid #e0e0e0",
									borderRadius: "8px",
									height: "fit-content",
									position: "sticky",
									top: 0,
								}}
							>
								<Typography
									variant="h6"
									sx={{
										...(!isDarkMode && {
											color: "var(--color-text-secondary)",
										}),
									}}
								>
									Total:
								</Typography>
								<Typography variant="h4" color="primary">
									${totalPrice.toFixed(2)}
								</Typography>
								<Button
									variant="contained"
									color="success"
									fullWidth
									onClick={() => proceedToCheckout()}
									sx={{ mt: 1 }}
								>
									Proceed to Checkout
								</Button>
							</Box>
						</Grid>
					</Grid>
				)}
			</Container>
		</>
	);
};

export default CartPageLayout;
