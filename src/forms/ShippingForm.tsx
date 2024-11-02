import React from "react";
import { Box, Button, TextField, Typography, Container } from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import { ShippingFormValues } from "@common/interface";
import { useDispatch } from "react-redux";
import { updateShippingAddress } from "@store/cart.slice";
import { useRouter } from "next/router";
import useCartHandling from "src/hooks/useCartHandling";

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
				{renderTextField("address", "Complete Address")}
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
