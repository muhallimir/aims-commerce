import { useMediaQuery, useTheme } from "@mui/material";

const useScreenSize = () => {
    const theme = useTheme();
    const xs = useMediaQuery(theme.breakpoints.down("sm"));
    const sm = useMediaQuery(theme.breakpoints.down("md"));
    const md = useMediaQuery(theme.breakpoints.down("lg"));
    const lg = useMediaQuery(theme.breakpoints.down("xl"));

    return { xs, sm, md, lg };
};

export default useScreenSize;
