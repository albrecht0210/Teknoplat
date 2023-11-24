import { createTheme } from "@mui/material";
import { grey } from "@mui/material/colors";

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#f6b422'
        },
        secondary: {
            main: '#a67128'
        },
        text: {
            primary: '#fff',
            secondary: grey[500],
        }
    }
});

export default darkTheme;