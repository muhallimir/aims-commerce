import React from "react";
import { Container } from "@mui/material";
import PurchaseProgressBar from "src/components/bars/PurchaseProgressBar";
import ShippingForm from "src/forms/ShippingForm";

const ShippingLayout: React.FC = () => {
	return (
		<>
			<PurchaseProgressBar activeStep={1} />
			<Container maxWidth="lg" sx={{ minHeight: "100vh" }}>
				<ShippingForm />
			</Container>
		</>
	);
};

export default ShippingLayout;
