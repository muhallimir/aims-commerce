import { ProductCTAProps } from "@common/interface";
import Button from "@mui/material/Button";
import React from "react";

const ProductCTA: React.FC<ProductCTAProps> = ({
	variant = "contained",
	color = "primary",
	onClick,
	buttonText,
	disabled = false,
	sx = {},
}) => {
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
};

export default ProductCTA;
