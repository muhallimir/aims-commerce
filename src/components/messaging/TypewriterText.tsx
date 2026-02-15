import React, { useState, useEffect } from 'react';
import { Typography, Box } from '@mui/material';

interface TypewriterTextProps {
    text: string;
    speed?: number; // Characters per second
    onComplete?: () => void;
    variant?: 'body1' | 'body2' | 'caption' | 'subtitle1';
    sx?: Record<string, any>;
}

/**
 * TypewriterText - Displays text with a fast typing animation
 * Uses character-by-character reveal for a natural AI response feel
 */
const TypewriterText: React.FC<TypewriterTextProps> = ({
    text,
    speed = 80, // Default: 80 chars per second (fast but readable)
    onComplete,
    variant = 'body2',
    sx = {},
}) => {
    const [displayedText, setDisplayedText] = useState('');
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        // Reset when text changes
        setDisplayedText('');
        setIsComplete(false);

        if (!text) return;

        let currentIndex = 0;
        const intervalTime = 1000 / speed; // Convert chars/sec to ms/char

        const timer = setInterval(() => {
            if (currentIndex < text.length) {
                // Add multiple characters at once for faster effect
                const charsToAdd = Math.min(2, text.length - currentIndex);
                setDisplayedText(text.slice(0, currentIndex + charsToAdd));
                currentIndex += charsToAdd;
            } else {
                clearInterval(timer);
                setIsComplete(true);
                onComplete?.();
            }
        }, intervalTime);

        return () => clearInterval(timer);
    }, [text, speed, onComplete]);

    return (
        <Box sx={{ position: 'relative' }}>
            <Typography
                variant={variant}
                sx={{
                    fontSize: '0.9rem',
                    lineHeight: 1.4,
                    whiteSpace: 'pre-wrap',
                    ...sx,
                }}
            >
                {displayedText}
                {!isComplete && (
                    <Box
                        component="span"
                        sx={{
                            display: 'inline-block',
                            width: '2px',
                            height: '1em',
                            bgcolor: 'primary.main',
                            ml: 0.5,
                            animation: 'blink 0.7s infinite',
                            verticalAlign: 'text-bottom',
                            '@keyframes blink': {
                                '0%, 50%': { opacity: 1 },
                                '51%, 100%': { opacity: 0 },
                            },
                        }}
                    />
                )}
            </Typography>
        </Box>
    );
};

export default TypewriterText;
