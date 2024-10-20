import { createTheme } from "@mui/material";
import typography from "./typography";
import palettes from "./palettes";

const theme = createTheme({
  typography,
  palette: palettes,
  breakpoints: {
    values: {
      xs: 360,
      sm: 600,
      md: 1024,
      lg: 1282,
      xl: 1600,
    },
  },
});

export default theme;