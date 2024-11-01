import React from "react";
import { Container } from "@mui/material";
import PurchaseProgressBar from "src/components/bars/PurchaseProgressBar";
import ShippingForm from "src/forms/ShippingForm";

export default function ShippingLayout() {
	return (
		<>
			<PurchaseProgressBar activeStep={1} />
			<Container maxWidth="lg" sx={{ minHeight: "100vh" }}>
				<ShippingForm />
			</Container>
		</>
	);
}
