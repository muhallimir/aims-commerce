import { Button, Box, Typography } from "@mui/material";
import { useRouter } from "next/router";
import useThemeMode from "src/hooks/useThemeMode";
import MainLayout from "src/layouts/MainLayout";

export default function Custom404() {
    const router = useRouter();
    const { isDarkMode } = useThemeMode()

    return (
        <MainLayout>
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                minHeight="60vh"
                textAlign="center"
                px={2}
                sx={{ color: isDarkMode ? "common.white" : "primary.dark" }}
            >
                <Typography variant="h2" fontWeight="bold" gutterBottom>
                    404
                </Typography>
                <Typography variant="h5" gutterBottom>
                    Page Not Found
                </Typography>
                <Typography variant="body1" mb={4}>
                    The page you're looking for doesn't exist.
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => router.push("/store")}
                >
                    Go to Store
                </Button>
            </Box>
        </MainLayout>
    );
}
