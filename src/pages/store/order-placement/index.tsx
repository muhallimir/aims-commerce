import React from "react";
import { useSelector } from "react-redux";
import PurchaseProgressBar from "src/components/bars/PurchaseProgressBar";
import ComingSoon from "src/components/misc/ComingSoon";

const OrderPlacement: React.FC = () => {
	const theme = useSelector((state: any) => state.app.theme);
	return (
		<>
			<PurchaseProgressBar activeStep={3} />
			<ComingSoon darkMode={theme === "dark"} />
		</>
	);
};

export default OrderPlacement;
