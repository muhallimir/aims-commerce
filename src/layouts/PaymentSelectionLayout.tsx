import React from "react";
import { Container } from "@mui/material";
import PurchaseProgressBar from "src/components/bars/PurchaseProgressBar";
import SelectPaymentMethodForm from "src/forms/SelectPaymentMethodForm";

const PaymentSelectionLayout: React.FC = () => {
	return (
		<>
			<PurchaseProgressBar activeStep={2} />
			<Container maxWidth="lg" sx={{ minHeight: "100vh" }}>
				<SelectPaymentMethodForm />
			</Container>
		</>
	);
};

export default PaymentSelectionLayout;
