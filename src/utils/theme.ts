import { createTheme } from "@mui/material/styles";
//@ts-ignore
import '@fontsource-variable/red-hat-display';

export const theme = createTheme({
    typography: {
        fontFamily: `'Red Hat Display Variable', sans-serif`,
    },
    palette: {
        primary: {
            main: "#FF0000",        // rojo Avianca — botones principales, acentos, elementos destacados
            light: "#FF7F7F",       // rojo suave / hover / estados ligeros
            dark: "#CC0000",        // rojo oscuro — para hover activos, estados intensos
            contrastText: "#FFFFFF" // texto sobre rojo
        },
        secondary: {
            main: "#FFFFFF",        // blanco — para fondos, cards, contenedores secundarios
            light: "#FFFFFF",
            dark: "#F2F2F2",
            contrastText: "#FF0000"
        },
        background: {
            default: "#FFFFFF",     // fondo general blanco
            paper: "#F9F9F9"        // contenedores, tarjetas — blanco / casi blanco
        },
        text: {
            primary: "#2E2E2E",     // texto principal — oscuro neutro
            secondary: "#6D6D6D"    // texto secundario — gris medio
        },
        error: {
            main: "#D63A32"         // puedes mantener un rojo de error personalizado como el actual
        },
        info: {
            main: "#8FA4B3"         // opcional: tonos neutros/azules grises para información
        }
    }
});
