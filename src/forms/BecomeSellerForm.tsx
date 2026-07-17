import React from "react";
import { Box, Button, TextField, Typography, Container } from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { updateUserInfo } from "@store/user.slice";
import LoadingOverlay from "src/components/loaders/TextLoader";
import { useBecomeSellerMutation } from "@store/seller.slice";
import Cookies from "js-cookie";

const validationSchema = yup.object({
	name: yup.string().required("Name is required"),
	storeName: yup.string(),
});

const BecomeSellerForm: React.FC = () => {
	const [becomeSeller, { isLoading, isError, error, isSuccess }] =
		useBecomeSellerMutation();
	const userInfo = useSelector((state: any) => state.user.userInfo);
	const dispatch = useDispatch();
	const router = useRouter();

	const formik = useFormik({
		initialValues: { name: userInfo?.name || "", storeName: "" },
		validationSchema,
		onSubmit: async (values) => {
			const res = await becomeSeller({
				name: values.name,
				storeName: values.storeName,
			});
			if ("error" in res) return;

			// The /api/sellers/become response is the single source of truth:
			//   res.data.user  → updated user in CAMELCASE (isSeller, storeName, ...)
			//   res.data.token → fresh JWT with isSeller=true
			// We must NOT call getUser here. The /api/users/:id endpoint returns
			// raw snake_case data, and dispatching that into userInfo would
			// overwrite isSeller (camelCase) with is_seller (snake_case), making
			// userInfo.isSeller undefined. The destination /seller/* page then
			// sees !userInfo.isSeller → true and bounces the user back to this
			// form, which is the "clicked Start Selling, nothing happened" bug.
			if (res.data?.user) {
				dispatch(updateUserInfo(res.data.user));
			}
			if (res.data?.token) {
				Cookies.set("token", res.data.token, { path: "/" });
			}
			router.push("/seller/dashboard");
		},
	});

	return (
		<Container maxWidth="sm">
			{isLoading && <LoadingOverlay loadingMessage="Starting your selling journey..." />}
			<Box
				component="form"
				onSubmit={formik.handleSubmit}
				sx={{
					mt: 4,
					p: 3,
					boxShadow: 3,
					borderRadius: 2,
					backgroundColor: "common.white",
				}}
			>
				<Typography variant="h5" mb={2}>
					Start Selling
				</Typography>
				<TextField
					fullWidth
					id="name"
					name="name"
					label="Your Name"
					value={formik.values.name}
					onChange={formik.handleChange}
					error={formik.touched.name && Boolean(formik.errors.name)}
					helperText={
						formik.touched.name && typeof formik.errors.name === "string"
							? formik.errors.name
							: ""
					}
					margin="normal"
				/>
				<TextField
					fullWidth
					id="storeName"
					name="storeName"
					label="Store Name"
					value={formik.values.storeName}
					onChange={formik.handleChange}
					error={formik.touched.storeName && Boolean(formik.errors.storeName)}
					helperText={
						formik.touched.storeName &&
							typeof formik.errors.storeName === "string"
							? formik.errors.storeName
							: ""
					}
					margin="normal"
				/>
				<Button
					color="primary"
					variant="contained"
					fullWidth
					type="submit"
					sx={{ mt: 2 }}
				>
					Start Selling
				</Button>
				{isError && (
					<Typography color="error" mt={2}>
						{((): string => {
							if (error && typeof error === "object") {
								if (
									"data" in error &&
									error.data &&
									typeof error.data === "object" &&
									"message" in error.data
								) {
									return String(error.data.message);
								}
								if ("message" in error && typeof error.message === "string") {
									return error.message;
								}
							}
							return "Failed to start selling.";
						})()}
					</Typography>
				)}
				{isSuccess && (
					<Typography color="success.main" mt={2}>
						You are now a seller!
					</Typography>
				)}
			</Box>
		</Container>
	);
};

export default BecomeSellerForm;
