import { createTheme, type PaletteMode } from "@mui/material/styles";
//@ts-ignore
import '@fontsource-variable/red-hat-display';

export const getTheme = (mode: PaletteMode) => createTheme({
    palette: {
        mode,
        primary: {
            main: "#E63946",
            light: "#FF6B77",
            dark: "#C1121F",
            contrastText: "#FFFFFF"
        },
        secondary: {
            main: mode === 'dark' ? "#2E2E2E" : "#FFFFFF",
            light: mode === 'dark' ? "#3A3A3A" : "#FFFFFF",
            dark: mode === 'dark' ? "#1E1E1E" : "#F2F2F2",
            contrastText: mode === 'dark' ? "#FFFFFF" : "#2E2E2E"
        },
        background: {
            default: mode === 'dark' ? "#121212" : "#FFFFFF",
            paper: mode === 'dark' ? "#1E1E1E" : "#F9F9F9"
        },
        text: {
            primary: mode === 'dark' ? "#E0E0E0" : "#2E2E2E",
            secondary: mode === 'dark' ? "#B0B0B0" : "#6D6D6D"
        },
        error: {
            main: "#D63A32"
        },
        info: {
            main: "#8FA4B3"
        }
    },
    typography: {
        fontFamily: `'Red Hat Display Variable', sans-serif`,
    }
});
