import React, { useState, useEffect } from "react";
import {
	TextField,
	Switch,
	FormControlLabel,
	Button,
	Box,
	Typography,
	Card,
	CardContent,
	Stack,
	Divider,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useUpdateUserMutation } from "@store/user.slice";
import { useRouter } from "next/router";
import { switchSection } from "@store/admin.slice";
import { setSellerInfo, useUpdateSellerProfileMutation } from "@store/seller.slice";

const AdminEditUserForm: React.FC = () => {
	const { adminUsersData } = useSelector(({ user }: any) => user);
	const { sellerInfo } = useSelector((state: any) => state.seller);
	const { userInView: user } = adminUsersData || {};
	const [name, setName] = useState(user.name);
	const [email, setEmail] = useState(user.email);
	const [isAdmin, setIsAdmin] = useState(user.isAdmin);
	const [isSeller, setIsSeller] = useState<boolean>(user.isSeller || false);
	const [storeName, setStoreName] = useState("");
	const [storeDescription, setStoreDescription] = useState("");
	const [phone, setPhone] = useState("");
	const [address, setAddress] = useState("");
	const [city, setCity] = useState("");
	const [country, setCountry] = useState("");

	const [reqUpdateUser] = useUpdateUserMutation();
	const [updateSellerProfile] = useUpdateSellerProfileMutation();
	const dispatch = useDispatch();

	const router = useRouter();

	useEffect(() => {
		if (user?.isSeller) {
			// If we have sellerInfo in state for this user, use it
			if (sellerInfo && sellerInfo._id === user._id) {
				setStoreName(sellerInfo.storeName || "");
				setStoreDescription(sellerInfo.storeDescription || "");
				setPhone(sellerInfo.phone || user.phone || "");
				setAddress(sellerInfo.address || user.address || "");
				setCity(sellerInfo.city || user.city || "");
				setCountry(sellerInfo.country || user.country || "");
			} else {
				// Use user data as fallback
				setStoreName(user.storeName || "");
				setStoreDescription(user.storeDescription || "");
				setPhone(user.phone || "");
				setAddress(user.address || "");
				setCity(user.city || "");
				setCountry(user.country || "");
			}
		}
	}, [user, sellerInfo]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const userId = router?.query?._id;
		const userInfo = {
			_id: userId,
			name,
			email,
			isAdmin,
			isSeller,
		};

		try {
			// Update user info
			await reqUpdateUser({ userId, userInfo }).unwrap();

			// If user is a seller, also update seller profile
			if (isSeller) {
				const sellerPayload = {
					userId: userId,
					name,
					email,
					storeName,
					storeDescription,
					phone,
					address,
					city,
					country,
				};

				await updateSellerProfile(sellerPayload).unwrap();

				// Update sellerInfo in state if this is the current seller
				if (sellerInfo && sellerInfo._id === userId) {
					dispatch(setSellerInfo({
						...sellerInfo,
						...sellerPayload
					}));
				}
			}

			dispatch(switchSection("users"));
			router.push("/admin");
		} catch (error) {
			console.error("Error updating user:", error);
		}
	};

	return (
		<Card
			sx={{
				maxWidth: 500,
				mx: "auto",
				mt: 4,
				p: 3,
				borderRadius: 2,
				boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
			}}
		>
			<CardContent>
				<Typography variant="h5" align="center" gutterBottom>
					Edit User
				</Typography>

				<Box
					component="form"
					onSubmit={handleSubmit}
					sx={{ display: "flex", flexDirection: "column", gap: 3 }}
				>
					<TextField
						label="Name"
						value={name}
						onChange={(e) => setName(e.target.value)}
						fullWidth
						required
						variant="outlined"
					/>

					<TextField
						label="Email"
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						fullWidth
						required
						variant="outlined"
					/>

					<Stack direction="row" spacing={3} justifyContent="center">
						<FormControlLabel
							control={
								<Switch
									checked={isAdmin}
									onChange={(e) => setIsAdmin(e.target.checked)}
									color="primary"
								/>
							}
							label="Admin"
							labelPlacement="end"
						/>
						<FormControlLabel
							control={
								<Switch
									checked={isSeller}
									onChange={(e) => setIsSeller(e.target.checked)}
									color="secondary"
								/>
							}
							label="Seller"
							labelPlacement="end"
						/>
					</Stack>

					{/* Seller-specific fields */}
					{isSeller && (
						<>
							<Divider sx={{ my: 2 }} />
							<Typography variant="h6" gutterBottom>
								Seller Information
							</Typography>

							<TextField
								label="Store Name"
								value={storeName}
								onChange={(e) => setStoreName(e.target.value)}
								fullWidth
								variant="outlined"
							/>

							<TextField
								label="Store Description"
								value={storeDescription}
								onChange={(e) => setStoreDescription(e.target.value)}
								fullWidth
								multiline
								rows={3}
								variant="outlined"
							/>

							<TextField
								label="Phone"
								value={phone}
								onChange={(e) => setPhone(e.target.value)}
								fullWidth
								variant="outlined"
							/>

							<TextField
								label="Address"
								value={address}
								onChange={(e) => setAddress(e.target.value)}
								fullWidth
								variant="outlined"
							/>

							<Box sx={{ display: "flex", gap: 2 }}>
								<TextField
									label="City"
									value={city}
									onChange={(e) => setCity(e.target.value)}
									fullWidth
									variant="outlined"
								/>
								<TextField
									label="Country"
									value={country}
									onChange={(e) => setCountry(e.target.value)}
									fullWidth
									variant="outlined"
								/>
							</Box>
						</>
					)}

					<Box sx={{ mt: 2, color: "text.secondary" }}>
						<Typography variant="body2">
							Created At: {new Date(user.createdAt).toLocaleString()}
						</Typography>
						<Typography variant="body2">
							Last Updated: {new Date(user.updatedAt).toLocaleString()}
						</Typography>
					</Box>

					<Button
						type="submit"
						variant="contained"
						color="primary"
						fullWidth
						sx={{
							py: 1.5,
							fontSize: "1rem",
							mt: 1,
							borderRadius: "8px",
							boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
							"&:hover": {
								backgroundColor: "primary.dark",
							},
						}}
					>
						Save Changes
					</Button>
				</Box>
			</CardContent>
		</Card>
	);
};

export default AdminEditUserForm;
