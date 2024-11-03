import React from "react";
import { Stepper, Step, StepLabel, Box } from "@mui/material";
import { useRouter } from "next/router";
import { keyframes } from "@emotion/react";
import useThemeMode from "src/hooks/useThemeMode";

const steps = [
	{ label: "Order", path: "/store/cart" },
	{ label: "Shipping", path: "/store/shipping" },
	{ label: "Payment", path: "/store/payment-selection" },
	{ label: "Checkout", path: "/store/checkout" },
];

const blink = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
`;

export default function PurchaseProgressBar({ activeStep }) {
	const router = useRouter();
	const { isDarkMode } = useThemeMode();

	const handleStepClick = (index) => {
		if (index < activeStep) {
			router.push(steps[index].path);
		}
	};

	return (
		<Box sx={{ width: "100%", mt: 3 }}>
			<Stepper activeStep={activeStep} alternativeLabel>
				{steps.map((step, index) => (
					<Step
						key={step.label}
						onClick={() => handleStepClick(index)}
						sx={{
							cursor: index < activeStep ? "pointer" : "default",
							color: "gold",
						}}
					>
						<StepLabel
							sx={{
								animation:
									index < activeStep ? `${blink} 1.3s infinite` : "none",
								color: isDarkMode ? "gold" : "inherit",
								"& .MuiStepIcon-root": {
									...(isDarkMode && { color: "gold" }),
								},
								"&.Mui-active": {
									...(isDarkMode && { color: "gold" }),
								},
								".MuiStepIcon-text ": {
									...(isDarkMode && { color: "common.black" }),
								},
								".MuiStepLabel-label": {
									...(isDarkMode && { color: "gold" }),
								},
							}}
						>
							{step.label}
						</StepLabel>
					</Step>
				))}
			</Stepper>
		</Box>
	);
}
