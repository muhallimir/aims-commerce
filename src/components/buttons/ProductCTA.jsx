import Button from "@mui/material/Button";
import React from "react";

export default function ProductCTA({
	variant,
	color,
	onClick,
	buttonText,
	disabled,
	sx,
}) {
	return (
		<Button
			variant={variant}
			color={color}
			onClick={onClick}
			sx={{
				backgroundColor: "primary-aims.main",
				"&:hover": {
					backgroundColor: "var(--primary-aims-dark)",
				},
				"&.Mui-disabled": {
					color: "status.outOfStock",
					opacity: 1,
					backgroundColor: "grey.light",
				},
				...sx,
			}}
			disabled={disabled}
		>
			{buttonText}
		</Button>
	);
}
