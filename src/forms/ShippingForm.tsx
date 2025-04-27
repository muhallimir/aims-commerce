import React, { useState } from "react";
import { Box, Button, TextField, Typography, Container, Autocomplete, CircularProgress, InputAdornment, IconButton, Dialog, DialogTitle, DialogContent } from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import { ShippingFormValues } from "@common/interface";
import { useDispatch } from "react-redux";
import { updateShippingAddress } from "@store/cart.slice";
import { useRouter } from "next/router";
import useCartHandling from "src/hooks/useCartHandling";
import useAddressAutoComplete from "src/hooks/useAddressAutoComplete";

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
