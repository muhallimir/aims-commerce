import React, { useState } from "react";
import { Box, Button, TextField, Typography, Container, Autocomplete, CircularProgress, InputAdornment, IconButton, Dialog, DialogTitle, DialogContent, Paper } from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import { ShippingFormValues } from "@common/interface";
import { useDispatch } from "react-redux";
import { updateShippingAddress } from "@store/cart.slice";
import { useRouter } from "next/router";
import useCartHandling from "src/hooks/useCartHandling";
import useAddressAutoComplete from "src/hooks/useAddressAutoComplete";
import { LocationOn as LocationIcon, AutoFixHigh as AutoIcon } from "@mui/icons-material";
import { orangeGlow, shimmer } from "@common/animations";

const validationSchema = yup.object({
	fullName: yup.string().required("Full name is required"),
	contactNo: yup
		.string()
		.required("Contact number is required")
		.matches(/^[0-9]+$/, "Contact number must be numeric")
		.min(10, "Contact number should be at least 10 digits")
		.max(15, "Contact number should not exceed 15 digits"),
	address: yup.string().required("Address is required"),
	city: yup.string().required("City is required"),
	postalCode: yup
		.string()
		.required("Postal code is required")
		.matches(/^[0-9]+$/, "Postal code must be numeric"),
	country: yup.string().required("Country is required"),
});

const ShippingForm: React.FC = () => {
	const dispatch = useDispatch();
	const router = useRouter();
	const { shippingAddress } = useCartHandling();
	const [addressQuery, setAddressQuery] = useState("");
	const { suggestions, loading } = useAddressAutoComplete(addressQuery);
	const [isGeneratingAddress, setIsGeneratingAddress] = useState(false);

	// Generate dummy address data
	const generateDummyAddress = () => {
		setIsGeneratingAddress(true);

		const dummyAddresses = [
			{
				fullName: "John Demo Smith",
				contactNo: "1234567890",
				address: "123 Main Street, Downtown",
				city: "New York",
				postalCode: "10001",
				country: "United States"
			},
			{
				fullName: "Sarah Demo Johnson",
				contactNo: "9876543210",
				address: "456 Oak Avenue, Central District",
				city: "Los Angeles",
				postalCode: "90210",
				country: "United States"
			},
			{
				fullName: "Mike Demo Wilson",
				contactNo: "5551234567",
				address: "789 Pine Road, Business Quarter",
				city: "Chicago",
				postalCode: "60601",
				country: "United States"
			},
			{
				fullName: "Emma Demo Brown",
				contactNo: "4449876543",
				address: "321 Elm Street, Residential Area",
				city: "Houston",
				postalCode: "77001",
				country: "United States"
			}
		];

		setTimeout(() => {
			const randomAddress = dummyAddresses[Math.floor(Math.random() * dummyAddresses.length)];
			formik.setValues(randomAddress);
			setIsGeneratingAddress(false);
		}, 1000);
	};

	const formik = useFormik<ShippingFormValues>({
		initialValues: {
			fullName: shippingAddress.fullName || "",
			contactNo: shippingAddress.contactNo || "",
			address: shippingAddress.address || "",
			city: shippingAddress.city || "",
			postalCode: shippingAddress.postalCode || "",
			country: shippingAddress.country || "",
		},
		validationSchema,
		onSubmit: (values) => {
			dispatch(updateShippingAddress(values));
			router.push("/store/payment-selection");
		},
	});


	const handleSelectLocation = (selectedAddress: string, details: Partial<ShippingFormValues>) => {
		formik.setFieldValue("address", selectedAddress);
		if (details.city) formik.setFieldValue("city", details.city);
		if (details.postalCode) formik.setFieldValue("postalCode", details.postalCode);
		if (details.country) formik.setFieldValue("country", details.country);
	};

	const renderTextField = (name: keyof ShippingFormValues, label: string) => (
		<TextField
			fullWidth
			margin="dense"
			label={label}
			name={name}
			placeholder={`Enter ${label.toLowerCase()}`}
			value={formik.values[name]}
			onChange={formik.handleChange}
			onBlur={formik.handleBlur}
			error={formik.touched[name] && Boolean(formik.errors[name])}
			helperText={formik.touched[name] && formik.errors[name]}
		/>
	);

	return (
		<Container maxWidth="sm">
			<Box
				component="form"
				onSubmit={formik.handleSubmit}
				sx={{
					mt: 4,
					p: 3,
					boxShadow: 3,
					borderRadius: 2,
					backgroundColor: "background.light",
				}}
			>
				<Typography
					variant="h5"
					gutterBottom
					color="text.secondary"
					sx={{ fontWeight: "bold", textAlign: "center" }}
				>
					Shipping Address
				</Typography>

				{/* Demo Address Generator */}
				<Paper
					elevation={2}
					sx={{
						mt: 2,
						mb: 3,
						p: 2,
						backgroundColor: "warning.50",
						border: "1px solid",
						borderColor: "warning.200",
					}}
				>
					<Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
						<LocationIcon sx={{ color: "warning.main", mr: 1 }} />
						<Typography
							variant="h6"
							sx={{ fontWeight: 600, color: "warning.main", fontSize: "1rem" }}
						>
							Demo Project - Quick Address Fill
						</Typography>
					</Box>
					<Typography
						variant="body2"
						sx={{ mb: 2, color: "text.secondary", lineHeight: 1.6 }}
					>
						Skip the manual entry! Generate a realistic demo address to quickly test the checkout process.
					</Typography>
					<Button
						variant="contained"
						color="warning"
						fullWidth
						onClick={generateDummyAddress}
						startIcon={<AutoIcon />}
						disabled={isGeneratingAddress}
						sx={{
							fontWeight: 600,
							textTransform: "none",
							py: 1.2,
							position: "relative",
							overflow: "hidden",
							animation: `${orangeGlow} 2.5s ease-in-out infinite`,
							"&:hover": {
								animation: "none",
								transform: "scale(1.02)",
								boxShadow: "0 4px 20px rgba(255, 152, 0, 0.4)",
							},
							"&:disabled": {
								animation: "none",
								opacity: 0.6,
							},
							"&::before": {
								content: '""',
								position: "absolute",
								top: 0,
								left: "-100%",
								width: "100%",
								height: "100%",
								background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
								animation: `${shimmer} 3s ease-in-out infinite`,
							},
						}}
					>
						{isGeneratingAddress ? "Generating Address..." : "Generate Demo Address"}
					</Button>
					<Typography
						variant="caption"
						sx={{
							display: "block",
							textAlign: "center",
							mt: 1,
							color: "text.secondary",
							fontStyle: "italic"
						}}
					>
						Instantly fills all address fields with realistic demo data
					</Typography>
				</Paper>

				{renderTextField("fullName", "Full Name")}
				{renderTextField("contactNo", "Contact No.")}

				<Autocomplete
					freeSolo
					options={suggestions.map((option) => option.display_name)}
					loading={loading}
					onInputChange={(_event, value) => {
						setAddressQuery(value);
						formik.setFieldValue("address", value);
					}}
					onChange={(_event, value) => {
						const selected = suggestions.find((s) => s.display_name === value);
						if (selected) {
							formik.setFieldValue("address", selected.display_name);
							formik.setFieldValue("city", selected.address?.city || selected.address?.town || selected.address?.village || "");
							formik.setFieldValue("postalCode", selected.address?.postcode || "");
							formik.setFieldValue("country", selected.address?.country || "");
						}
					}}
					renderInput={(params) => (
						<TextField
							{...params}
							fullWidth
							margin="dense"
							label="Complete Address"
							placeholder="Enter your address"
							value={formik.values.address}
							error={formik.touched.address && Boolean(formik.errors.address)}
							helperText={formik.touched.address && formik.errors.address}
						/>
					)}
				/>

				{renderTextField("city", "City")}
				{renderTextField("postalCode", "Postal Code")}
				{renderTextField("country", "Country")}

				<Button
					type="submit"
					variant="contained"
					color="success"
					fullWidth
					sx={{ mt: 3, py: 1.5, fontSize: "1rem", fontWeight: "bold" }}
				>
					Continue
				</Button>
			</Box>
		</Container>
	);
};

export default ShippingForm;
