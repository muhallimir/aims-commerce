import React from "react";
import { Box, Button, TextField, Typography, Container } from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import { RegistrationFormValues } from "@common/interface";

const validationSchema = yup.object({
	name: yup.string().required("Name is required"),
	email: yup
		.string()
		.email("Enter a valid email")
		.required("Email is required"),
	password: yup
		.string()
		.required("Password is required")
		.min(8, "Password should be at least 8 characters"),
	confirmPassword: yup
		.string()
		.required("Confirm Password is required")
		.oneOf([yup.ref("password"), null], "Passwords must match"),
});

const RegistrationForm: React.FC = () => {
	const formik = useFormik<RegistrationFormValues>({
		initialValues: { name: "", email: "", password: "", confirmPassword: "" },
		validationSchema: validationSchema,
		onSubmit: (values) => {
			console.log("Registration submitted:", values); // Todo: API integ
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
					Register
				</Typography>

				<TextField
					fullWidth
					margin="dense"
					label="Name"
					name="name"
					placeholder="Enter your name"
					value={formik.values.name}
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					error={formik.touched.name && Boolean(formik.errors.name)}
					helperText={formik.touched.name && formik.errors.name}
					InputProps={{ autoComplete: "off" }}
				/>

				<TextField
					fullWidth
					margin="dense"
					label="Email"
					name="email"
					placeholder="Enter your email"
					value={formik.values.email}
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					error={formik.touched.email && Boolean(formik.errors.email)}
					helperText={formik.touched.email && formik.errors.email}
					InputProps={{ autoComplete: "off" }}
				/>

				<TextField
					fullWidth
					margin="dense"
					label="Password"
					type="password"
					name="password"
					placeholder="Enter your password"
					value={formik.values.password}
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					error={formik.touched.password && Boolean(formik.errors.password)}
					helperText={formik.touched.password && formik.errors.password}
					InputProps={{ autoComplete: "off" }}
				/>

				<TextField
					fullWidth
					margin="dense"
					label="Confirm Password"
					type="password"
					name="confirmPassword"
					placeholder="Confirm your password"
					value={formik.values.confirmPassword}
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					error={
						formik.touched.confirmPassword &&
						Boolean(formik.errors.confirmPassword)
					}
					helperText={
						formik.touched.confirmPassword && formik.errors.confirmPassword
					}
					InputProps={{ autoComplete: "off" }}
				/>

				<Button
					type="submit"
					variant="contained"
					color="success"
					fullWidth
					sx={{ mt: 3, py: 1.5, fontSize: "1rem", fontWeight: "bold" }}
				>
					Register
				</Button>
			</Box>
		</Container>
	);
};

export default RegistrationForm;
