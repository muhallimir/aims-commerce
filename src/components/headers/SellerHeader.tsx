import React from "react";
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Avatar,
    Box,
    Menu,
    MenuItem,
} from "@mui/material";
import {
    Store as StoreIcon,
    AccountCircle,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { clearUserInfo } from "@store/user.slice";
import useAuthentication from "src/hooks/useAuthentication";

const SellerHeader: React.FC = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const { userInfo } = useSelector((state: any) => state.user);
    const { handleSignOut } = useAuthentication();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleSignOut();
        handleMenuClose();
    };

    const handleViewStore = () => {
        router.push("/store");
        handleMenuClose();
    };

    const handleProfile = () => {
        router.push("/profile");
        handleMenuClose();
    };

    return (
        <AppBar
            position="static"
            sx={{
                transition: "width 0.3s ease, margin-left 0.3s ease",
                bgcolor: "primary.main",
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                zIndex: (theme) => theme.zIndex.drawer + 1,
            }}
        >
            <Toolbar
                sx={{
                    minHeight: { xs: 56, sm: 64 },
                    height: { xs: 56, sm: 64 },
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
                    <StoreIcon sx={{ mr: 1 }} />
                    <Typography variant="h6" component="div">
                        Seller Dashboard
                    </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography variant="body2" sx={{ mr: 2 }}>
                        Welcome, {userInfo?.name}
                    </Typography>
                    <IconButton
                        size="large"
                        aria-label="account of current user"
                        aria-controls="primary-search-account-menu"
                        aria-haspopup="true"
                        onClick={handleProfileMenuOpen}
                        color="inherit"
                    >
                        <Avatar sx={{ width: 32, height: 32 }}>
                            <AccountCircle />
                        </Avatar>
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        anchorOrigin={{
                            vertical: "top",
                            horizontal: "right",
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: "top",
                            horizontal: "right",
                        }}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                    >
                        <MenuItem onClick={handleProfile}>Profile</MenuItem>
                        <MenuItem onClick={handleViewStore}>View Store</MenuItem>
                        <MenuItem onClick={handleLogout}>Logout</MenuItem>
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default SellerHeader;
