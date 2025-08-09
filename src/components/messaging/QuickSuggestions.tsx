import React from 'react';
import {
    Box,
    Chip,
    Stack,
    Typography,
} from '@mui/material';

interface QuickSuggestionsProps {
    suggestions: string[];
    onSuggestionClick: (suggestion: string) => void;
}

const QuickSuggestions: React.FC<QuickSuggestionsProps> = ({
    suggestions,
    onSuggestionClick,
}) => {
    if (!suggestions || suggestions.length === 0) {
        return null;
    }

    return (
        <Box sx={{ mt: 2 }}>
            <Typography
                variant="caption"
                sx={{
                    color: 'text.secondary',
                    fontWeight: 500,
                    mb: 1,
                    display: 'block',
                }}
            >
                Quick suggestions:
            </Typography>

            <Stack
                direction="row"
                spacing={1}
                sx={{
                    flexWrap: 'wrap',
                    gap: 1,
                }}
            >
                {suggestions.map((suggestion, index) => (
                    <Chip
                        key={index}
                        label={suggestion}
                        variant="outlined"
                        size="small"
                        clickable
                        onClick={() => onSuggestionClick(suggestion)}
                        sx={{
                            fontSize: '0.75rem',
                            height: 28,
                            borderColor: 'rgba(102, 126, 234, 0.3)',
                            color: '#667eea',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                                borderColor: '#667eea',
                                backgroundColor: 'rgba(102, 126, 234, 0.08)',
                                transform: 'translateY(-1px)',
                            },
                            '&:active': {
                                transform: 'translateY(0)',
                            },
                        }}
                    />
                ))}
            </Stack>
        </Box>
    );
};

export default QuickSuggestions;
