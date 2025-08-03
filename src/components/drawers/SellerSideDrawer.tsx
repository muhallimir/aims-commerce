import React from "react";
import {
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
    Box,
    Divider,
    IconButton,
    Tooltip,
} from "@mui/material";
import {
    Dashboard as DashboardIcon,
    Inventory as ProductsIcon,
    ShoppingCart as OrdersIcon,
    Person as ProfileIcon,
    Menu as MenuIcon,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { switchSection } from "@store/seller.slice";

interface SellerSideDrawerProps {
    isSidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
}

const SellerSideDrawer: React.FC<SellerSideDrawerProps> = ({
    isSidebarOpen,
    setSidebarOpen,
}) => {
    const dispatch = useDispatch();
    const { section } = useSelector((state: any) => state.seller);
    const { userInfo } = useSelector((state: any) => state.user);

    console.log("SellerSideDrawer userInfo:", userInfo);

    const menuItems = [
        { id: "overview", label: "Overview", icon: <DashboardIcon /> },
        { id: "products", label: "Products", icon: <ProductsIcon /> },
        { id: "orders", label: "Orders", icon: <OrdersIcon /> },
        { id: "profile", label: "Profile", icon: <ProfileIcon /> },
    ];

    const handleSectionChange = (sectionId: string) => {
        dispatch(switchSection(sectionId));
        if (typeof window !== "undefined" && window.innerWidth < 900) {
            setSidebarOpen(false);
        }
    };

    return (
        <Drawer
            variant="permanent"
            open={isSidebarOpen}
            sx={{
                width: isSidebarOpen ? 280 : 70,
                flexShrink: 0,
                "& .MuiDrawer-paper": {
                    width: isSidebarOpen ? 280 : 70,
                    boxSizing: "border-box",
                    transition: "width 0.3s ease",
                    bgcolor: "grey.50",
                    borderRight: "1px solid rgba(0,0,0,0.12)",
                    overflowX: "hidden",
                },
            }}
        >
            <Box
                sx={{
                    height: { xs: 56, sm: 64 },
                    minHeight: { xs: 56, sm: 64 },
                    display: "flex",
                    alignItems: "center",
                    justifyContent: isSidebarOpen ? "space-between" : "center",
                    px: isSidebarOpen ? 3 : 1,
                    bgcolor: "primary.main",
                    color: "white",
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    {isSidebarOpen && (
                        <Box>
                            <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }}>
                                {userInfo?.storeName || userInfo?.name || "My Store"}
                            </Typography>
                            <Typography variant="caption" component="div">
                                Seller Panel
                            </Typography>
                        </Box>
                    )}
                </Box>

                <IconButton
                    sx={{
                        color: "white",
                        ml: isSidebarOpen ? 0 : 0,
                    }}
                    onClick={() => setSidebarOpen(!isSidebarOpen)}
                    size="small"
                >
                    <MenuIcon />
                </IconButton>
            </Box>

            <Divider />

            <List sx={{ pt: 2 }}>
                {menuItems.map((item) => (
                    <ListItem key={item.id} disablePadding>
                        <Tooltip
                            title={!isSidebarOpen ? item.label : ""}
                            placement="right"
                            arrow
                        >
                            <ListItemButton
                                onClick={() => handleSectionChange(item.id)}
                                selected={section === item.id}
                                sx={{
                                    minHeight: 48,
                                    justifyContent: isSidebarOpen ? "initial" : "center",
                                    px: 2.5,
                                    mx: 1,
                                    borderRadius: 2,
                                    "&.Mui-selected": {
                                        bgcolor: "primary.main",
                                        color: "white",
                                        "&:hover": {
                                            bgcolor: "primary.dark",
                                        },
                                    },
                                    "&:hover": {
                                        bgcolor: "grey.100",
                                    },
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: isSidebarOpen ? 3 : "auto",
                                        justifyContent: "center",
                                        color: section === item.id ? "white" : "inherit",
                                    }}
                                >
                                    {item.icon}
                                </ListItemIcon>
                                {isSidebarOpen && (
                                    <ListItemText
                                        primary={item.label}
                                        sx={{
                                            "& .MuiListItemText-primary": {
                                                fontWeight: section === item.id ? "bold" : "medium",
                                            },
                                        }}
                                    />
                                )}
                            </ListItemButton>
                        </Tooltip>
                    </ListItem>
                ))}
            </List>
        </Drawer>
    );
};

export default SellerSideDrawer;
