import React from "react";
import { Box, Button, Typography, Paper, Link } from "@mui/material";
import { Info as InfoIcon, PlayArrow as PlayArrowIcon, PersonAdd as PersonAddIcon } from "@mui/icons-material";
import { useRouter } from "next/router";
import { pulseGlow, shimmer } from "@common/animations";

interface DemoBannerProps {
    onDemoLogin?: () => void;
    isLoading?: boolean;
    isRegisterLoading?: boolean;
    isSignInForm?: boolean;
}

const DemoBanner: React.FC<DemoBannerProps> = ({
    onDemoLogin,
    isLoading = false,
    isRegisterLoading = false,
    isSignInForm = false
}) => {
    const router = useRouter();

    const handleNavigation = () => {
        if (isSignInForm) {
            router.push("/register");
        } else {
            router.push("/signin");
        }
    };

    return (
        <Paper
            elevation={2}
            sx={{
                mt: 3,
                p: 3,
                backgroundColor: "info.50",
                border: "1px solid",
                borderColor: "info.200",
            }}
        >
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <InfoIcon sx={{ color: "info.main", mr: 1 }} />
                <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, color: "info.main" }}
                >
                    {isSignInForm ? "Demo Project" : "Demo Project - Easy Registration"}
                </Typography>
            </Box>
            <Typography
                variant="body2"
                sx={{ mb: 2, color: "text.secondary", lineHeight: 1.6, textAlign: "left" }}
            >
                This is a demonstration of aims-commerce web app. You can explore the features by:
            </Typography>
            <Box component="ul" sx={{ pl: 2, mb: 2, color: "text.secondary", textAlign: "left" }}>
                <Typography component="li" variant="body2" sx={{ mb: 0.5, textAlign: "left" }}>
                    {isSignInForm ? (
                        <>
                            <Link
                                component="button"
                                onClick={handleNavigation}
                                color="primary"
                                sx={{ textDecoration: "underline", cursor: "pointer" }}
                            >
                                Create a user account
                            </Link>
                            {" "}for full access to all features
                        </>
                    ) : (
                        "Any name and email format (no verification required)"
                    )}
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 0.5, textAlign: "left" }}>
                    {isSignInForm ? "Using any email format (no verification required)" : "Password with at least 8 characters"}
                </Typography>
                <Typography component="li" variant="body2" sx={{ textAlign: "left" }}>
                    {isSignInForm ? "Creating a password with at least 8 characters" : "Or get instant access with a unique demo account"}
                </Typography>
                {isSignInForm && (
                    <Typography component="li" variant="body2" sx={{ textAlign: "left" }}>
                        Or create a real demo account instantly (saves credentials for you)
                    </Typography>
                )}
            </Box>
            <Button
                variant="contained"
                color="info"
                fullWidth
                onClick={isSignInForm ? onDemoLogin : handleNavigation}
                startIcon={isSignInForm ? <PlayArrowIcon /> : <PersonAddIcon />}
                disabled={isLoading || isRegisterLoading}
                sx={{
                    fontWeight: 600,
                    textTransform: "none",
                    py: 1.2,
                    position: "relative",
                    overflow: "hidden",
                    animation: `${pulseGlow} 2s ease-in-out infinite`,
                    "&:hover": {
                        bgcolor: "info.dark",
                        animation: "none",
                        transform: "scale(1.02)",
                        boxShadow: "0 4px 20px rgba(33, 150, 243, 0.4)",
                    },
                    "&:disabled": {
                        animation: "none",
                        opacity: 0.6,
                    },
                    "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: "-100%",
                        width: "100%",
                        height: "100%",
                        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
                        animation: `${shimmer} 3s ease-in-out infinite`,
                    },
                }}
            >
                {isSignInForm
                    ? (isRegisterLoading ? "Creating Demo Account..." : "Create & Login Demo Account")
                    : "Go to Demo Account Creation"
                }
            </Button>
            <Typography
                variant="caption"
                sx={{
                    display: "block",
                    textAlign: "center",
                    mt: 1,
                    color: "text.secondary",
                    fontStyle: "italic"
                }}
            >
                {isSignInForm
                    ? "Creates a real demo account with unique credentials"
                    : "Creates a real demo account with saved credentials"
                }
            </Typography>
        </Paper>
    );
};

export default DemoBanner;
