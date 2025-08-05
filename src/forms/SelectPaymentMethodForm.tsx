import React, { use } from "react";
import {
	Box,
	Button,
	FormControl,
	FormControlLabel,
	Radio,
	RadioGroup,
	Typography,
	Container,
} from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { updatePaymentMethod } from "@store/cart.slice";
import { useRouter } from "next/router";

const validationSchema = yup.object({
	paymentMethod: yup.string().required("Please select a payment method"),
});

const SelectPaymentMethodForm: React.FC = () => {
	const { isDemo } = useSelector((state: any) => state.app);
	const dispatch = useDispatch();
	const router = useRouter();
	const formik = useFormik({
		initialValues: { paymentMethod: isDemo ? "stripe" : "paypal" },
		validationSchema: validationSchema,
		onSubmit: ({ paymentMethod }) => {
			dispatch(updatePaymentMethod(paymentMethod));
			router.push("/store/checkout");
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
					Select Payment Method
				</Typography>

				<FormControl component="fieldset" fullWidth sx={{ mt: 2 }}>
					<RadioGroup
						aria-label="paymentMethod"
						name="paymentMethod"
						value={formik.values.paymentMethod}
						onChange={(e) => formik.setFieldValue("paymentMethod", e.target.value)}
					>
						<FormControlLabel
							value="stripe"
							control={<Radio />}
							label={
								<Typography color={formik.values.paymentMethod === "stripe" ? "primary" : "text.primary"}>
									Stripe
								</Typography>
							}
						/>
						<FormControlLabel
							value="paypal"
							control={<Radio />}
							disabled={isDemo}
							label={
								<Typography color={formik.values.paymentMethod === "paypal" ? "primary" : "text.primary"}>
									PayPal {''}
									<Typography component="span" sx={{ fontSize: "0.8rem", color: "text.primary" }}>
										{isDemo && "(disabled in demo mode)"}
									</Typography>
								</Typography>
							}
						/>
						<FormControlLabel
							value="bankTransfer"
							control={<Radio disabled />}
							label={
								<Typography color={formik.values.paymentMethod === "bankTransfer" ? "primary" : ""}>
									Bank Transfer (Coming Soon)
								</Typography>
							}
						/>
					</RadioGroup>
					{formik.touched.paymentMethod && formik.errors.paymentMethod && (
						<Typography color="error" variant="body2">
							{formik.errors.paymentMethod}
						</Typography>
					)}
				</FormControl>

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

export default SelectPaymentMethodForm;
