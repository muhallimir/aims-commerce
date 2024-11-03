import React from "react";
import PurchaseProgressBar from "src/components/bars/PurchaseProgressBar";
import CheckoutLayout from "src/layouts/CheckoutLayout";

const OrderPlacement: React.FC = () => {
	return (
		<>
			<PurchaseProgressBar activeStep={3} />
			<CheckoutLayout />
		</>
	);
};

export default OrderPlacement;
