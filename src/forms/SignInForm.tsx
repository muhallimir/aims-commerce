import React from "react";
import {
	Box,
	Button,
	TextField,
	Typography,
	Container,
	Link,
} from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import { useRouter } from "next/router";
import LoadingOverlay from "src/components/loaders/TextLoader";
import { LOADERTEXT } from "@common/constants";
import { SignInFormValues } from "@common/interface";
import useAuthentication from "src/hooks/useAuthentication";
import { getErrorMessage } from "@helpers/getErrorMessage";

const validationSchema = yup.object({
	email: yup
		.string()
		.email("Must be a valid email")
		.required("Email is required"),
	password: yup
		.string()
		.required("Password is required")
		.min(6, "Password should be at least 6 characters"),
});

const SignInForm: React.FC = () => {
	const router = useRouter();
	const { reqSignIn, resSignIn } = useAuthentication();
	const { isLoading, isError, error } = resSignIn;

	const formik = useFormik<SignInFormValues>({
		initialValues: { email: "", password: "" },
		validationSchema: validationSchema,
		onSubmit: (values) => {
			reqSignIn(values);
		},
	});

	return (
		<Container maxWidth="sm">
			{isLoading && <LoadingOverlay loadingMessage={LOADERTEXT.SIGN_IN} />}
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
					Sign In
				</Typography>
				<TextField
					fullWidth
					margin="dense"
					label="Email"
					name="email"
					placeholder="Enter email"
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
					placeholder="Enter password"
					value={formik.values.password}
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					error={formik.touched.password && Boolean(formik.errors.password)}
					helperText={formik.touched.password && formik.errors.password}
					InputProps={{ autoComplete: "off" }}
				/>

				<Button
					type="submit"
					variant="contained"
					color="primary"
					fullWidth
					sx={{ mt: 3, py: 1.5, fontSize: "1rem", fontWeight: "bold" }}
				>
					Sign In
				</Button>

				{isError && (
					<Typography
						variant="body2"
						color="error"
						sx={{ mt: 2, textAlign: "center" }}
					>
						{getErrorMessage(error)}
					</Typography>
				)}

				<Box sx={{ mt: 2, textAlign: "center" }}>
					<Typography variant="body2" color="textSecondary">
						New to Aims-Commerce?{" "}
						<Link
							component="button"
							onClick={() => router.push("/register")}
							color="primary"
						>
							Create your account
						</Link>
					</Typography>
				</Box>
			</Box>
		</Container>
	);
};

export default SignInForm;
