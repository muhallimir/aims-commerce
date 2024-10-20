import { GlobalStyles } from '@mui/material';
import variables from './theme/variables';

const setGlobalStyles = (props) => (
    <GlobalStyles
        styles={{
            ':root': {
                ...variables,
                ...props,
            },
        }}
    />
);

export default setGlobalStyles;
