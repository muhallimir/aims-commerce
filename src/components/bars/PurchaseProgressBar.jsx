import React from "react";
import { Stepper, Step, StepLabel, Box } from "@mui/material";
import { useRouter } from "next/router";
import { keyframes } from "@emotion/react";

const steps = [
	{ label: "Order", path: "/store/cart" },
	{ label: "Shipping", path: "/store/shipping" },
	{ label: "Payment", path: "/store/payment" },
	{ label: "Checkout", path: "/store/checkout" },
];

// Define a blinking animation
const blink = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
`;

export default function PurchaseProgressBar({ activeStep }) {
	const router = useRouter();

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
						sx={{ cursor: index < activeStep ? "pointer" : "default" }}
					>
						<StepLabel
							sx={{
								animation: index < activeStep ? `${blink} 1s infinite` : "none",
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
