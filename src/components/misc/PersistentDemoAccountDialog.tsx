import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Paper,
    Chip,
} from "@mui/material";
import {
    CheckCircle as CheckCircleIcon,
    Close as CloseIcon,
    Person as PersonIcon,
    Email as EmailIcon,
    Lock as LockIcon,
    ContentCopy as CopyIcon,
    Check as CheckIcon
} from "@mui/icons-material"; import { useDispatch } from "react-redux";
import { setIsDemo } from "@store/app.slice";
interface DemoAccountInfo {
    name: string;
    email: string;
    password: string;
    createdAt: string;
}

const PersistentDemoAccountDialog: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [demoAccountInfo, setDemoAccountInfo] = useState<DemoAccountInfo | null>(null);
    const dispatch = useDispatch();
    const [copiedField, setCopiedField] = useState<string | null>(null);

    useEffect(() => {
        const checkForDemoAccount = () => {
            const storedDemoInfo = localStorage.getItem('demoAccountInfo');
            if (storedDemoInfo) {
                try {
                    const accountInfo = JSON.parse(storedDemoInfo);
                    setDemoAccountInfo(accountInfo);
                    setOpen(true);
                    dispatch(setIsDemo(true));
                } catch (error) {
                    localStorage.removeItem('demoAccountInfo');
                    dispatch(setIsDemo(false));
                }
            }
        };

        checkForDemoAccount();

        const interval = setInterval(checkForDemoAccount, 1000);

        return () => clearInterval(interval);
    }, []);

    const handleClose = () => {
        setOpen(false);
        localStorage.removeItem('demoAccountInfo');
        setDemoAccountInfo(null);
        setCopiedField(null);
    };

    const handleCopyCredentials = async (text: string, field: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedField(field);
            setTimeout(() => setCopiedField(null), 2000);
        } catch (error) {
            console.error("Failed to copy to clipboard:", error);
        }
    }; if (!demoAccountInfo) return null;


    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            sx={{
                zIndex: 9999,
            }}
        >
            <DialogTitle>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <CheckCircleIcon sx={{ color: "success.main", mr: 1 }} />
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            Demo Account Ready!
                        </Typography>
                    </Box>
                    <Button
                        onClick={handleClose}
                        size="small"
                        sx={{ minWidth: "auto", p: 1 }}
                    >
                        <CloseIcon />
                    </Button>
                </Box>
            </DialogTitle>
            <DialogContent>
                <Typography variant="body1" sx={{ mb: 3, color: "success.dark" }}>
                    🎉 Your unique demo account has been created successfully! Save these credentials to test login/logout features:
                </Typography>

                <Paper sx={{ p: 3, bgcolor: "success.50", border: "1px solid", borderColor: "success.200" }}>
                    <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                            <PersonIcon sx={{ fontSize: 16, color: "text.secondary", mr: 0.5 }} />
                            <Typography variant="subtitle2" color="text.secondary">
                                Name:
                            </Typography>
                        </Box>
                        <Chip
                            label={demoAccountInfo.name}
                            variant="outlined"
                            onClick={() => handleCopyCredentials(demoAccountInfo.name, 'name')}
                            icon={copiedField === 'name' ? <CheckIcon sx={{ fontSize: 16 }} /> : <CopyIcon sx={{ fontSize: 16 }} />}
                            sx={{
                                fontFamily: "monospace",
                                cursor: "pointer",
                                "&:hover": { bgcolor: "action.hover" },
                                "& .MuiChip-icon": {
                                    color: copiedField === 'name' ? "success.main" : "text.secondary"
                                }
                            }}
                        />
                        {copiedField === 'name' && (
                            <Typography variant="caption" sx={{ ml: 1, color: "success.main" }}>
                                Copied!
                            </Typography>
                        )}
                    </Box>

                    <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                            <EmailIcon sx={{ fontSize: 16, color: "text.secondary", mr: 0.5 }} />
                            <Typography variant="subtitle2" color="text.secondary">
                                Email:
                            </Typography>
                        </Box>
                        <Chip
                            label={demoAccountInfo.email}
                            variant="outlined"
                            onClick={() => handleCopyCredentials(demoAccountInfo.email, 'email')}
                            icon={copiedField === 'email' ? <CheckIcon sx={{ fontSize: 16 }} /> : <CopyIcon sx={{ fontSize: 16 }} />}
                            sx={{
                                fontFamily: "monospace",
                                cursor: "pointer",
                                "&:hover": { bgcolor: "action.hover" },
                                "& .MuiChip-icon": {
                                    color: copiedField === 'email' ? "success.main" : "text.secondary"
                                }
                            }}
                        />
                        {copiedField === 'email' && (
                            <Typography variant="caption" sx={{ ml: 1, color: "success.main" }}>
                                Copied!
                            </Typography>
                        )}
                    </Box>

                    <Box>
                        <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                            <LockIcon sx={{ fontSize: 16, color: "text.secondary", mr: 0.5 }} />
                            <Typography variant="subtitle2" color="text.secondary">
                                Password:
                            </Typography>
                        </Box>
                        <Chip
                            label={demoAccountInfo.password}
                            variant="outlined"
                            onClick={() => handleCopyCredentials(demoAccountInfo.password, 'password')}
                            icon={copiedField === 'password' ? <CheckIcon sx={{ fontSize: 16 }} /> : <CopyIcon sx={{ fontSize: 16 }} />}
                            sx={{
                                fontFamily: "monospace",
                                cursor: "pointer",
                                "&:hover": { bgcolor: "action.hover" },
                                "& .MuiChip-icon": {
                                    color: copiedField === 'password' ? "success.main" : "text.secondary"
                                }
                            }}
                        />
                        {copiedField === 'password' && (
                            <Typography variant="caption" sx={{ ml: 1, color: "success.main" }}>
                                Copied!
                            </Typography>
                        )}
                    </Box>
                </Paper>                <Typography variant="body2" sx={{ mt: 2, color: "text.secondary" }}>
                    💡 <strong>Tip:</strong> Click any credential to copy it to your clipboard. You can now:
                </Typography>
                <Box component="ul" sx={{ mt: 1, pl: 3, color: "text.secondary" }}>
                    <Typography component="li" variant="body2">
                        Explore the entire e-commerce platform
                    </Typography>
                    <Typography component="li" variant="body2">
                        Test the login/logout functionality
                    </Typography>
                    <Typography component="li" variant="body2">
                        Make purchases and track orders
                    </Typography>
                    <Typography component="li" variant="body2">
                        Access all user features
                    </Typography>
                </Box>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
                <Button
                    onClick={handleClose}
                    variant="contained"
                    color="success"
                    fullWidth
                    sx={{ fontWeight: 600 }}
                >
                    Got it! Start Exploring 🚀
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default PersistentDemoAccountDialog;
