import React, { useState, useEffect } from "react";
import { Box, Button, TextField, Typography, Container } from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import LoadingOverlay from "src/components/loaders/TextLoader";
import { getErrorMessage } from "@helpers/getErrorMessage";
import useAuthentication from "src/hooks/useAuthentication";

const validationSchema = yup.object({
	name: yup.string().optional(),
	email: yup.string().email("Enter a valid email").optional(),
	newPassword: yup
		.string()
		.optional()
		.min(8, "Password should be at least 8 characters"),
	confirmPassword: yup
		.string()
		.optional()
		.oneOf([yup.ref("newPassword"), null], "Passwords must match"),
});

const ProfileForm: React.FC = () => {
	const { userInfo, reqUpdateProfile, resUpdateProfile } = useAuthentication();
	const { isLoading, isError, error } = resUpdateProfile;

	const [successMessage, setSuccessMessage] = useState<string | null>(null);

	const formik = useFormik({
		initialValues: {
			name: userInfo?.name || "",
			email: userInfo?.email || "",
			newPassword: "",
			confirmPassword: "",
		},
		validationSchema: validationSchema,
		onSubmit: async (values) => {
			if (!values.newPassword || !values.confirmPassword) {
				formik.setErrors({
					newPassword: !values.newPassword
						? "New password is required"
						: undefined,
					confirmPassword: !values.confirmPassword
						? "Confirm password is required"
						: undefined,
				});
				return;
			}

			if (values.newPassword !== values.confirmPassword) {
				formik.setErrors({ confirmPassword: "Passwords must match" });
				return;
			}

			await reqUpdateProfile(values);
			if (!isError) {
				setSuccessMessage("Profile updated successfully!");
				setTimeout(() => {
					setSuccessMessage(null);
				}, 3000);
			}
		},
	});

	useEffect(() => {
		if (isError) {
			setSuccessMessage(null);
		}
	}, [isError]);

	const isModified =
		formik.values.name !== userInfo?.name ||
		formik.values.email !== userInfo?.email ||
		formik.values.newPassword !== "" ||
		formik.values.confirmPassword !== "";

	return (
		<Container maxWidth="sm">
			{isLoading && (
				<LoadingOverlay
					variant="overlay"
					loadingMessage="Updating Profile..."
				/>
			)}
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
					Update Profile
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
					label="New Password"
					type="password"
					name="newPassword"
					placeholder="Enter your new password"
					value={formik.values.newPassword}
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					error={
						formik.touched.newPassword && Boolean(formik.errors.newPassword)
					}
					helperText={formik.touched.newPassword && formik.errors.newPassword}
					InputProps={{ autoComplete: "off" }}
				/>

				<TextField
					fullWidth
					margin="dense"
					label="Confirm Password"
					type="password"
					name="confirmPassword"
					placeholder="Confirm your new password"
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

				{isError && (
					<Typography
						variant="body2"
						color="error"
						sx={{ mt: 2, textAlign: "center" }}
					>
						{getErrorMessage(error)}
					</Typography>
				)}

				{successMessage && (
					<Typography
						variant="body2"
						color="success.main"
						sx={{ mt: 2, textAlign: "center" }}
					>
						{successMessage}
					</Typography>
				)}

				<Button
					type="submit"
					variant="contained"
					color="primary"
					fullWidth
					sx={{ mt: 3, py: 1.5, fontSize: "1rem", fontWeight: "bold" }}
					disabled={!isModified}
				>
					Update Profile
				</Button>
			</Box>
		</Container>
	);
};

export default ProfileForm;
