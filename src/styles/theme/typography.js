import { createTheme } from '@mui/material';

const theme = createTheme();

const typography = {
    fontFamily: [
        '-apple-system',
        'system-ui',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        '"Fira Sans"',
        'Ubuntu',
        'Oxygen',
        '"Oxygen Sans"',
        'Cantarell',
        '"Droid Sans"',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
        '"Lucida Grande"',
        'Helvetica',
        'Arial',
        'sans-serif',
    ].join(','),

    /* -------------------------------- variants -------------------------------- */

    h1: {
        fontWeight: 700,
        fontSize: '2rem',
        lineHeight: '2.5rem',
        [theme.breakpoints.up('sm')]: {
            fontSize: '2.5rem',
            lineHeight: '3rem',
        },
        [theme.breakpoints.up('md')]: {
            fontSize: '3rem',
            lineHeight: '3.5rem',
        },
    },
    h2: {
        fontWeight: 700,
        fontSize: '1.75rem',
        lineHeight: '2.2rem',
        [theme.breakpoints.up('sm')]: {
            fontSize: '2rem',
            lineHeight: '2.5rem',
        },
        [theme.breakpoints.up('md')]: {
            fontSize: '2.5rem',
            lineHeight: '3rem',
        },
    },
    h3: {
        fontWeight: 600,
        fontSize: '1.5rem',
        lineHeight: '2rem',
        [theme.breakpoints.up('sm')]: {
            fontSize: '1.75rem',
            lineHeight: '2.2rem',
        },
        [theme.breakpoints.up('md')]: {
            fontSize: '2rem',
            lineHeight: '2.5rem',
        },
    },
    h4: {
        fontWeight: 700,
        fontSize: '1.25rem',
        lineHeight: '1.75rem',
        [theme.breakpoints.up('sm')]: {
            fontSize: '1.563rem',
            lineHeight: '2rem',
        },
        [theme.breakpoints.up('md')]: {
            fontSize: '1.875rem',
            lineHeight: '2.25rem',
        },
    },
    h5: {
        fontWeight: 600,
        fontSize: '1rem',
        lineHeight: '1.5rem',
        [theme.breakpoints.up('sm')]: {
            fontSize: '1.125rem',
            lineHeight: '1.75rem',
        },
        [theme.breakpoints.up('md')]: {
            fontSize: '1.25rem',
            lineHeight: '1.875rem',
        },
    },
    h6: {
        fontWeight: 500,
        fontSize: '0.875rem',
        lineHeight: '1.25rem',
        [theme.breakpoints.up('sm')]: {
            fontSize: '1rem',
            lineHeight: '1.5rem',
        },
        [theme.breakpoints.up('md')]: {
            fontSize: '1.125rem',
            lineHeight: '1.75rem',
        },
    },
    body1: {
        fontWeight: 400,
        fontSize: '1rem',
        lineHeight: '1.5rem',
        [theme.breakpoints.up('sm')]: {
            fontSize: '1.125rem',
            lineHeight: '1.75rem',
        },
        [theme.breakpoints.up('md')]: {
            fontSize: '1.25rem',
            lineHeight: '1.875rem',
        },
    },
    body2: {
        fontWeight: 400,
        fontSize: '0.8rem',
        lineHeight: '1rem',
        [theme.breakpoints.up('sm')]: {
            fontSize: '0.875rem',
            lineHeight: '1.25rem',
        },
        [theme.breakpoints.up('md')]: {
            fontSize: '1rem',
            lineHeight: '1.5rem',
        },
    },
    menu_xs: {
        fontWeight: 400,
        fontSize: '12px',
        lineHeight: '15px',
    },
    auth1: {
        fontWeight: 600,
        fontSize: '16px',
        lineHeight: '24px',
    },
    hero_headline: {
        fontWeight: 300,
        fontSize: '56px',
        lineHeight: '67px',
        [theme.breakpoints.down('md')]: {
            fontSize: '48px',
            lineHeight: '58px',
        },
        [theme.breakpoints.down('sm')]: {
            fontSize: '32px',
            lineHeight: '40px',
        },
    },
    tc_text: {
        fontWeight: 400,
        fontSize: '12px',
        lineHeight: '18px',
        [theme.breakpoints.up('sm')]: {
            fontSize: '14px',
            lineHeight: '20px',
        },
    },
};

export default typography;

