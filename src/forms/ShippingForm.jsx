import React from "react";
import { Box, Button, TextField, Typography, Container } from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";

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

export default function ShippingForm() {
	const formik = useFormik({
		initialValues: {
			fullName: "",
			contactNo: "",
			address: "",
			city: "",
			postalCode: "",
			country: "",
		},
		validationSchema: validationSchema,
		onSubmit: (values) => {
			console.log("Submitted:", values); // Replace with actual form submission logic
		},
	});

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

				<TextField
					fullWidth
					margin="dense"
					label="Full Name"
					name="fullName"
					placeholder="Enter full name"
					value={formik.values.fullName}
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					error={formik.touched.fullName && Boolean(formik.errors.fullName)}
					helperText={formik.touched.fullName && formik.errors.fullName}
				/>

				<TextField
					fullWidth
					margin="dense"
					label="Contact No."
					name="contactNo"
					placeholder="Enter contact no."
					value={formik.values.contactNo}
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					error={formik.touched.contactNo && Boolean(formik.errors.contactNo)}
					helperText={formik.touched.contactNo && formik.errors.contactNo}
				/>

				<TextField
					fullWidth
					margin="dense"
					label="Complete Address"
					name="address"
					placeholder="Enter address"
					value={formik.values.address}
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					error={formik.touched.address && Boolean(formik.errors.address)}
					helperText={formik.touched.address && formik.errors.address}
				/>

				<TextField
					fullWidth
					margin="dense"
					label="City"
					name="city"
					placeholder="Enter city"
					value={formik.values.city}
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					error={formik.touched.city && Boolean(formik.errors.city)}
					helperText={formik.touched.city && formik.errors.city}
				/>

				<TextField
					fullWidth
					margin="dense"
					label="Postal Code"
					name="postalCode"
					placeholder="Enter postal code"
					value={formik.values.postalCode}
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					error={formik.touched.postalCode && Boolean(formik.errors.postalCode)}
					helperText={formik.touched.postalCode && formik.errors.postalCode}
				/>

				<TextField
					fullWidth
					margin="dense"
					label="Country"
					name="country"
					placeholder="Enter country"
					value={formik.values.country}
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					error={formik.touched.country && Boolean(formik.errors.country)}
					helperText={formik.touched.country && formik.errors.country}
				/>

				<Button
					type="submit"
					variant="contained"
					color="primary"
					fullWidth
					sx={{ mt: 3, py: 1.5, fontSize: "1rem", fontWeight: "bold" }}
				>
					Continue
				</Button>
			</Box>
		</Container>
	);
}
