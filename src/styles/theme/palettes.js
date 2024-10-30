import _var from './variables';

const lightPalette = {
    mode: 'light',
    common: {
        black: _var['--common-black'],
        white: _var['--common-white'],
    },
    primary: {
        light: _var['--primary-aims-light'],
        main: _var['--primary-aims-main'],
        dark: _var['--primary-aims-dark'],
    },
    grey: {
        light: _var['--grey-light'],
        medium: _var['--grey-medium'],
        dark: _var['--grey-dark'],
    },
    button: {
        primary: _var['--color-button-primary'],
        primaryHover: _var['--color-button-primary-hover'],
        secondary: _var['--color-button-secondary'],
        secondaryHover: _var['--color-button-container-secondary-emphasis-hover'],
    },
    text: {
        primary: _var['--color-text-primary'],
        secondary: _var['--color-text-secondary'],
        accent: _var['--color-text-accent'],
        accent2: _var['--color-text-accent-2'],
        lowEmphasis: _var['--color-text-low-emphasis'],
    },
    status: {
        success: _var['--color-success'],
        warning: _var['--color-warning'],
        error: _var['--color-error'],
        outOfStock: _var['--color-out-of-stock'], // Added out-of-stock color
    },
    background: {
        light: _var['--background-light'],
        dark: _var['--background-dark'],
    },
};

export default lightPalette;
