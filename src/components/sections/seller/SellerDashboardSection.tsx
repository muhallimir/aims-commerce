import React from "react";
import { Box } from "@mui/material";

interface SellerDashboardSectionProps {
    children: React.ReactNode;
}

const SellerDashboardSection: React.FC<SellerDashboardSectionProps> = ({
    children,
}) => {
    return (
        <Box
            component="main"
            sx={{
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
                p: 3,
                bgcolor: "grey.50",
                transition: "margin-left 0.3s ease",
                overflow: "auto",
            }}
        >
            {children}
        </Box>
    );
};

export default SellerDashboardSection;
