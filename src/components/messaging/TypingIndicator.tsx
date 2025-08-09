import React from 'react';
import { Box, Typography, keyframes } from '@mui/material';

const bounce = keyframes`
  0%, 60%, 100% {
    transform: scale(1);
    opacity: 0.7;
  }
  30% {
    transform: scale(1.4);
    opacity: 1;
  }
`;

const TypingIndicator: React.FC = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                p: 2,
                mb: 1,
            }}
        >
            <Box
                sx={{
                    bgcolor: '#f5f5f5',
                    borderRadius: '18px 18px 18px 4px',
                    p: 2,
                    minWidth: 60,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                }}
            >
                <Box
                    sx={{
                        width: 8,
                        height: 8,
                        bgcolor: '#999',
                        borderRadius: '50%',
                        animation: `${bounce} 1.4s infinite ease-in-out`,
                        animationDelay: '0s',
                    }}
                />
                <Box
                    sx={{
                        width: 8,
                        height: 8,
                        bgcolor: '#999',
                        borderRadius: '50%',
                        animation: `${bounce} 1.4s infinite ease-in-out`,
                        animationDelay: '0.2s',
                    }}
                />
                <Box
                    sx={{
                        width: 8,
                        height: 8,
                        bgcolor: '#999',
                        borderRadius: '50%',
                        animation: `${bounce} 1.4s infinite ease-in-out`,
                        animationDelay: '0.4s',
                    }}
                />
            </Box>
            <Typography
                variant="caption"
                sx={{
                    color: 'text.secondary',
                    fontStyle: 'italic',
                }}
            >
                AI Assistant is typing...
            </Typography>
        </Box>
    );
};

export default TypingIndicator;
