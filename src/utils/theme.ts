import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
    typography: {
        fontFamily: `'Inter Variable', sans-serif`,
        h1: { fontFamily: `'Inter Variable', sans-serif` },
        h2: { fontFamily: `'Inter Variable', sans-serif` },
        h3: { fontFamily: `'Inter Variable', sans-serif` },
        h4: { fontFamily: `'Inter Variable', sans-serif` },
        h5: { fontFamily: `'Inter Variable', sans-serif` },
        h6: { fontFamily: `'Inter Variable', sans-serif` },
        body1: { fontFamily: `'Ubuntu', sans-serif` },
        body2: { fontFamily: `'Ubuntu', sans-serif` }
    },
    palette: {
        primary: {
            main: "#F6C450",   // Botones principales, elementos destacados
            light: "#FCECC7",  // Fondos suaves, tarjetas claras, hovers
        },
        secondary: {
            main: "#F5A623",   // Etiquetas, acentos, indicadores secundarios
        },
        text: {
            primary: "#2E2E2E",   // Texto principal (títulos y contenido)
            secondary: "#6D6D6D", // Texto secundario (descripciones, subtítulos)
        },
        background: {
            default: "#FFFFFF",  // Fondo general de la app
            paper: "#F7F7F8",    // Contenedores, tarjetas, secciones elevadas
        },
        error: {
            main: "#D63A32",     // Alertas, mensajes de error, iconos críticos
        },
        info: {
            main: "#8FA4B3",     // Información, iconos suaves, estados neutrales
        }
    }
});