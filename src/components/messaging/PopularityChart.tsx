import React from 'react';
import { Box, Typography, Tooltip, useTheme } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

interface Product {
    _id: string;
    name: string;
    rating: number;
    numReviews: number;
    price: number;
    image?: string;
}

interface PopularityChartProps {
    products: Product[];
    maxDisplay?: number;
}

/**
 * PopularityChart - Mini bar chart showing product popularity by ratings
 * Displays products sorted from most to least popular with visual bars
 */
const PopularityChart: React.FC<PopularityChartProps> = ({
    products,
    maxDisplay = 5,
}) => {
    const theme = useTheme();

    // Sort products by rating (descending), then by number of reviews
    const sortedProducts = [...products]
        .sort((a, b) => {
            if (b.rating !== a.rating) return b.rating - a.rating;
            return b.numReviews - a.numReviews;
        })
        .slice(0, maxDisplay);

    // Find max rating for scaling bars
    const maxRating = 5; // Standard 5-star system

    // Calculate popularity score (rating * log(reviews + 1))
    const getPopularityScore = (product: Product) => {
        return product.rating * Math.log10(product.numReviews + 1);
    };

    const maxPopularity = Math.max(...sortedProducts.map(getPopularityScore), 1);

    // Color gradient based on rank
    const getBarColor = (index: number) => {
        const colors = [
            'linear-gradient(90deg, #FFD700 0%, #FFA500 100%)', // Gold - 1st
            'linear-gradient(90deg, #C0C0C0 0%, #A8A8A8 100%)', // Silver - 2nd
            'linear-gradient(90deg, #CD7F32 0%, #B87333 100%)', // Bronze - 3rd
            'linear-gradient(90deg, #667eea 0%, #764ba2 100%)', // Purple - 4th+
            'linear-gradient(90deg, #4ade80 0%, #16a34a 100%)', // Green - 5th
        ];
        return colors[Math.min(index, colors.length - 1)];
    };

    const getRankEmoji = (index: number) => {
        const emojis = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];
        return emojis[Math.min(index, emojis.length - 1)];
    };

    if (!products || products.length === 0) {
        return null;
    }

    return (
        <Box
            sx={{
                p: 2,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)',
                border: '1px solid rgba(102, 126, 234, 0.2)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                mb: 2,
                animation: 'fadeInChart 0.5s ease-out',
                '@keyframes fadeInChart': {
                    from: {
                        opacity: 0,
                        transform: 'translateY(10px)',
                    },
                    to: {
                        opacity: 1,
                        transform: 'translateY(0)',
                    },
                },
            }}
        >
            {/* Header */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    mb: 2,
                    pb: 1.5,
                    borderBottom: '1px solid rgba(102, 126, 234, 0.15)',
                }}
            >
                <TrendingUpIcon sx={{ color: '#667eea', fontSize: '1.3rem' }} />
                <Typography
                    variant="subtitle2"
                    sx={{
                        fontWeight: 700,
                        color: '#1e293b',
                        fontSize: '0.85rem',
                    }}
                >
                    Popularity Ranking
                </Typography>
                <Box
                    sx={{
                        ml: 'auto',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        px: 1,
                        py: 0.25,
                        borderRadius: 1,
                        bgcolor: 'rgba(102, 126, 234, 0.1)',
                    }}
                >
                    <StarIcon sx={{ fontSize: '0.75rem', color: '#fbbf24' }} />
                    <Typography
                        variant="caption"
                        sx={{ color: '#64748b', fontSize: '0.7rem' }}
                    >
                        By Rating
                    </Typography>
                </Box>
            </Box>

            {/* Chart Bars */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {sortedProducts.map((product, index) => {
                    const popularityScore = getPopularityScore(product);
                    const barWidth = (popularityScore / maxPopularity) * 100;
                    const ratingWidth = (product.rating / maxRating) * 100;

                    return (
                        <Tooltip
                            key={product._id}
                            title={
                                <Box sx={{ p: 0.5 }}>
                                    <Typography variant="caption" sx={{ fontWeight: 600 }}>
                                        {product.name}
                                    </Typography>
                                    <Typography variant="caption" display="block">
                                        ⭐ {product.rating.toFixed(1)} ({product.numReviews} reviews)
                                    </Typography>
                                    <Typography variant="caption" display="block">
                                        💰 ${product.price.toFixed(2)}
                                    </Typography>
                                </Box>
                            }
                            arrow
                            placement="top"
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    cursor: 'pointer',
                                    p: 0.75,
                                    borderRadius: 1,
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        bgcolor: 'rgba(102, 126, 234, 0.08)',
                                        transform: 'translateX(4px)',
                                    },
                                    animation: `slideInBar 0.4s ease-out ${index * 0.1}s both`,
                                    '@keyframes slideInBar': {
                                        from: {
                                            opacity: 0,
                                            transform: 'translateX(-20px)',
                                        },
                                        to: {
                                            opacity: 1,
                                            transform: 'translateX(0)',
                                        },
                                    },
                                }}
                            >
                                {/* Rank */}
                                <Typography
                                    sx={{
                                        fontSize: '0.9rem',
                                        minWidth: '24px',
                                        textAlign: 'center',
                                    }}
                                >
                                    {getRankEmoji(index)}
                                </Typography>

                                {/* Product Name (truncated) */}
                                <Typography
                                    variant="caption"
                                    sx={{
                                        fontWeight: 500,
                                        color: '#334155',
                                        minWidth: '80px',
                                        maxWidth: '80px',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        fontSize: '0.75rem',
                                    }}
                                >
                                    {product.name}
                                </Typography>

                                {/* Bar Container */}
                                <Box
                                    sx={{
                                        flex: 1,
                                        height: '16px',
                                        bgcolor: 'rgba(0, 0, 0, 0.06)',
                                        borderRadius: '8px',
                                        overflow: 'hidden',
                                        position: 'relative',
                                    }}
                                >
                                    {/* Animated Bar */}
                                    <Box
                                        sx={{
                                            height: '100%',
                                            width: 0,
                                            background: getBarColor(index),
                                            borderRadius: '8px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'flex-end',
                                            pr: 0.75,
                                            animation: `growBar 0.8s ease-out ${0.3 + index * 0.15}s forwards`,
                                            '@keyframes growBar': {
                                                to: {
                                                    width: `${Math.max(ratingWidth, 20)}%`,
                                                },
                                            },
                                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                        }}
                                    />
                                </Box>

                                {/* Rating Display */}
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 0.25,
                                        minWidth: '50px',
                                    }}
                                >
                                    <StarIcon
                                        sx={{
                                            fontSize: '0.85rem',
                                            color: '#fbbf24',
                                        }}
                                    />
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            fontWeight: 600,
                                            color: '#1e293b',
                                            fontSize: '0.75rem',
                                        }}
                                    >
                                        {product.rating.toFixed(1)}
                                    </Typography>
                                </Box>
                            </Box>
                        </Tooltip>
                    );
                })}
            </Box>

            {/* Footer */}
            <Box
                sx={{
                    mt: 1.5,
                    pt: 1.5,
                    borderTop: '1px solid rgba(102, 126, 234, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Typography
                    variant="caption"
                    sx={{
                        color: '#94a3b8',
                        fontSize: '0.65rem',
                        fontStyle: 'italic',
                    }}
                >
                    Ranked by customer ratings & reviews
                </Typography>
            </Box>
        </Box>
    );
};

export default PopularityChart;
