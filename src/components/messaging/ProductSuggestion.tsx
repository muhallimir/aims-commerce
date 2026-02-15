import React, { useState, useCallback } from 'react';
import {
    Box,
    Card,
    CardContent,
    CardMedia,
    Typography,
    Rating,
    Chip,
    Button,
    Stack,
    Snackbar,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LoginIcon from '@mui/icons-material/Login';
import { Product } from 'src/services/chatbotService';
import { getImageUrl } from 'src/helpers/commonFn';
import { updateCartList } from 'src/store/cart.slice';
import useAuthentication from 'src/hooks/useAuthentication';

interface ProductSuggestionProps {
    products: Product[];
    onProductClick?: (product: Product) => void;
}

const ProductSuggestion: React.FC<ProductSuggestionProps> = ({
    products,
    onProductClick,
}) => {
    const router = useRouter();
    const dispatch = useDispatch();
    const { isAuthenticated } = useAuthentication();
    const cartItems = useSelector((state: any) => state.cart.cartItems);
    const [showSignInPrompt, setShowSignInPrompt] = useState(false);
    const [pendingProduct, setPendingProduct] = useState<Product | null>(null);
    const [notification, setNotification] = useState<{
        open: boolean;
        message: string;
        severity: 'success' | 'info' | 'warning' | 'error';
    }>({
        open: false,
        message: '',
        severity: 'success',
    });

    const handleProductClick = (product: Product) => {
        if (onProductClick) {
            onProductClick(product);
        }

        // Navigate to product page - the page component will handle fetching new data
        router.push(`/store/product/${product._id}`);
    };

    const handleAddToCart = useCallback((e: React.MouseEvent, product: Product) => {
        e.stopPropagation(); // Prevent triggering product click

        if (!isAuthenticated) {
            // Store the product user wanted to add
            setPendingProduct(product);
            setShowSignInPrompt(true);
            return;
        }

        dispatch(updateCartList(product));

        // Show success notification
        setNotification({
            open: true,
            message: `${product.name} added to cart!`,
            severity: 'success',
        });
    }, [isAuthenticated, dispatch]);

    const handleSignInRedirect = useCallback(() => {
        // Store pending product in sessionStorage to add after sign-in
        if (pendingProduct) {
            sessionStorage.setItem('pendingCartProduct', JSON.stringify(pendingProduct));
        }
        setShowSignInPrompt(false);
        // Use window.location.href for full page redirect (same as checkout flow)
        window.location.href = '/signin';
    }, [pendingProduct]);

    const handleCloseSignInPrompt = useCallback(() => {
        setShowSignInPrompt(false);
        setPendingProduct(null);
    }, []);

    const handleViewCart = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent triggering product click
        router.push('/store/cart');
    };

    const handleCloseNotification = () => {
        setNotification(prev => ({ ...prev, open: false }));
    };

    const isProductInCart = (productId: string) => {
        return cartItems.some((item: any) => item._id === productId);
    }; const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(price);
    };

    if (!products || products.length === 0) {
        return null;
    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                maxWidth: '100%',
                mt: 1,
            }}
        >
            {products.map((product, index) => (
                <Card
                    key={product._id}
                    sx={{
                        display: 'flex',
                        cursor: 'pointer',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        border: '1px solid rgba(0, 0, 0, 0.08)',
                        borderRadius: 3,
                        overflow: 'hidden',
                        animation: `slideInCard 0.3s ease-out ${index * 0.1}s both`,
                        '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
                            borderColor: '#667eea',
                        },
                        '&:active': {
                            transform: 'translateY(0)',
                        },
                        '@keyframes slideInCard': {
                            from: {
                                opacity: 0,
                                transform: 'translateY(20px) scale(0.95)',
                            },
                            to: {
                                opacity: 1,
                                transform: 'translateY(0) scale(1)',
                            },
                        },
                    }}
                    onClick={() => handleProductClick(product)}
                >
                    <CardMedia
                        component="img"
                        sx={{
                            width: 80,
                            height: 80,
                            objectFit: 'contain', // Changed from 'cover' to 'contain'
                            flexShrink: 0,
                            // backgroundColor: '#f5f5f5',
                            padding: 1, // Add padding to prevent touching edges
                        }}
                        image={getImageUrl(product.image) || 'https://via.placeholder.com/80x80/f5f5f5/9e9e9e?text=No+Image'}
                        alt={product.name}
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://via.placeholder.com/80x80/f5f5f5/9e9e9e?text=No+Image';
                        }}
                    />
                    <CardContent
                        sx={{
                            flex: 1,
                            p: 2,
                            '&:last-child': { pb: 2 },
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                        }}
                    >
                        <Box>
                            <Typography
                                variant="subtitle2"
                                sx={{
                                    fontWeight: 600,
                                    fontSize: '0.9rem',
                                    lineHeight: 1.3,
                                    mb: 0.5,
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                }}
                            >
                                {product.name}
                            </Typography>

                            <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                                <Rating
                                    value={product.rating}
                                    precision={0.1}
                                    readOnly
                                    size="small"
                                    sx={{ fontSize: '1rem' }}
                                />
                                <Typography variant="caption" color="text.secondary">
                                    ({product.numReviews})
                                </Typography>
                            </Stack>

                            <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
                                <Typography
                                    variant="h6"
                                    sx={{
                                        color: '#667eea',
                                        fontWeight: 700,
                                        fontSize: '1.1rem',
                                    }}
                                >
                                    {formatPrice(product.price)}
                                </Typography>

                                <Stack direction="row" spacing={1} alignItems="center">
                                    {product.countInStock > 0 ? (
                                        <Chip
                                            label="In Stock"
                                            size="small"
                                            sx={{
                                                bgcolor: '#e8f5e8',
                                                color: '#2e7d32',
                                                fontSize: '0.7rem',
                                                height: 20,
                                                '& .MuiChip-label': { px: 1 },
                                            }}
                                        />
                                    ) : (
                                        <Chip
                                            label="Out of Stock"
                                            size="small"
                                            sx={{
                                                bgcolor: '#ffebee',
                                                color: '#d32f2f',
                                                fontSize: '0.7rem',
                                                height: 20,
                                                '& .MuiChip-label': { px: 1 },
                                            }}
                                        />
                                    )}
                                </Stack>
                            </Stack>

                            {/* Add to Cart / View Cart Button */}
                            <Box sx={{ mt: 1 }}>
                                {product.countInStock > 0 && (
                                    isProductInCart(product._id) ? (
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            startIcon={<ShoppingCartIcon />}
                                            onClick={(e) => handleViewCart(e)}
                                            sx={{
                                                borderColor: '#667eea',
                                                color: '#667eea',
                                                fontSize: '0.75rem',
                                                py: 0.5,
                                                px: 1.5,
                                                '&:hover': {
                                                    borderColor: '#5a67d8',
                                                    backgroundColor: 'rgba(102, 126, 234, 0.05)',
                                                },
                                            }}
                                        >
                                            View Cart
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="contained"
                                            size="small"
                                            startIcon={<AddShoppingCartIcon />}
                                            onClick={(e) => handleAddToCart(e, product)}
                                            sx={{
                                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                color: 'white',
                                                fontSize: '0.75rem',
                                                py: 0.5,
                                                px: 1.5,
                                                boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
                                                '&:hover': {
                                                    background: 'linear-gradient(135deg, #5a67d8 0%, #6a4c93 100%)',
                                                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
                                                },
                                            }}
                                        >
                                            Add to Cart
                                        </Button>
                                    )
                                )}
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            ))}

            {products.length > 0 && (
                <Box sx={{ textAlign: 'center', mt: 1 }}>
                    <Typography
                        variant="caption"
                        sx={{
                            color: 'text.secondary',
                            fontStyle: 'italic',
                        }}
                    >
                        👆 Click any product to view details
                    </Typography>
                </Box>
            )}

            {/* Notification Snackbar */}
            <Snackbar
                open={notification.open}
                autoHideDuration={3000}
                onClose={handleCloseNotification}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                sx={{ zIndex: 2000 }}
            >
                <Alert
                    onClose={handleCloseNotification}
                    severity={notification.severity}
                    sx={{
                        width: '100%',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                        borderRadius: 2,
                    }}
                >
                    {notification.message}
                </Alert>
            </Snackbar>

            {/* Sign-In Prompt Dialog */}
            <Dialog
                open={showSignInPrompt}
                onClose={handleCloseSignInPrompt}
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        maxWidth: 400,
                        p: 1,
                    },
                }}
            >
                <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
                    <Box sx={{ mb: 1 }}>
                        <ShoppingCartIcon sx={{ fontSize: 48, color: '#667eea' }} />
                    </Box>
                    <Typography variant="h6" fontWeight={600}>
                        You&apos;re Almost There! 🎉
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        textAlign="center"
                        sx={{ mb: 2 }}
                    >
                        Sign in to add <strong>{pendingProduct?.name}</strong> to your cart and enjoy a personalized shopping experience.
                    </Typography>
                    <Box
                        sx={{
                            bgcolor: 'rgba(102, 126, 234, 0.08)',
                            borderRadius: 2,
                            p: 2,
                            textAlign: 'center',
                        }}
                    >
                        <Typography variant="caption" color="text.secondary">
                            ✨ Save your cart across devices<br />
                            🚀 Faster checkout experience<br />
                            📦 Track your orders easily
                        </Typography>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3, flexDirection: 'column', gap: 1 }}>
                    <Button
                        fullWidth
                        variant="contained"
                        startIcon={<LoginIcon />}
                        onClick={handleSignInRedirect}
                        sx={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            py: 1.5,
                            borderRadius: 2,
                            fontWeight: 600,
                            '&:hover': {
                                background: 'linear-gradient(135deg, #5a67d8 0%, #6a4c93 100%)',
                            },
                        }}
                    >
                        Sign In to Continue
                    </Button>
                    <Button
                        fullWidth
                        variant="text"
                        onClick={handleCloseSignInPrompt}
                        sx={{ color: 'text.secondary' }}
                    >
                        Maybe Later
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ProductSuggestion;
