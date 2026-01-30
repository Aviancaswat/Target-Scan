import { Box, Container, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export default function MaintenancePage() {
  const isDarkMode = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: isDarkMode
          ? "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)"
          : "linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%)",
      }}
    >
      <Container maxWidth="sm">
        <Box
          sx={{
            textAlign: "center",
            padding: 4,
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontWeight: "bold",
              marginBottom: 2,
              color: isDarkMode ? "#fff" : "#000",
              fontSize: { xs: "2rem", sm: "3rem" },
            }}
          >
            ⚙️
          </Typography>

          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              marginBottom: 2,
              color: isDarkMode ? "#fff" : "#000",
            }}
          >
            En Mantenimiento
          </Typography>

          <Typography
            variant="body1"
            sx={{
              fontSize: "1.1rem",
              marginBottom: 3,
              color: isDarkMode ? "#ccc" : "#666",
              lineHeight: 1.6,
            }}
          >
            Estamos realizando mejoras importantes en nuestra plataforma para ofrecerte una mejor experiencia.
          </Typography>

          <Typography
            variant="body2"
            sx={{
              fontSize: "1rem",
              color: isDarkMode ? "#aaa" : "#888",
            }}
          >
            Volveremos pronto. ¡Gracias por tu paciencia!
          </Typography>

          <Typography
            variant="caption"
            sx={{
              display: "block",
              marginTop: 4,
              color: isDarkMode ? "#888" : "#999",
            }}
          >
            Si tienes preguntas, contácta al equipo de Avianca evolutivos
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
