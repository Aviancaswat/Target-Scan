import { alpha, Typography, useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import ModalDetailsFeature from "./ModalDetailsFeature";

export default function GridCustom() {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    const cardStyle = {
        borderRadius: 3,
        height: 100,
        background: isDark 
            ? 'transparent'
            : `linear-gradient(${alpha(theme.palette.primary.main, 0.75)}, ${alpha(theme.palette.primary.main, 0.75)})`,
        border: isDark 
            ? `2px solid ${alpha('#FFFFFF', 0.15)}`
            : 'none',
        backdropFilter: isDark ? 'blur(10px)' : 'none',
        transition: 'all 0.3s ease',
        '&:hover': {
            borderColor: isDark ? alpha('#FFFFFF', 0.3) : 'transparent',
            boxShadow: isDark 
                ? `0 8px 32px ${alpha(theme.palette.primary.main, 0.2)}`
                : `0 8px 24px ${alpha(theme.palette.primary.main, 0.3)}`,
            transform: 'translateY(-4px)',
        }
    };

    return (
        <Grid
            spacing={2}
            className="animate__animated animate__fadeIn"
            sx={{
                width: {
                    xs: "95%",
                    lg: "80%"
                }
            }}
        >
            <Grid container size={{ xs: 12, md: 6 }} spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Box
                        display="flex"
                        flexDirection={"column"}
                        justifyContent="center"
                        alignItems="center"
                        sx={cardStyle}
                    >
                        <Box
                            display={"flex"}
                            alignItems={"flex-start"}
                            justifyContent={"space-between"}
                            width={"100%"}
                            height={"100%"}
                            px={1}
                            py={1}
                        >
                            <Typography
                                variant="h5"
                                component="h3"
                                marginLeft={2}
                                fontWeight={"bold"}
                                sx={{
                                    fontSize: {
                                        xs: "18px",
                                        md: "20px",
                                        lg: "24px"
                                    },
                                    color: isDark ? '#FFFFFF' : '#FFFFFF',
                                }}
                            >
                                Análisis Requerimientos
                            </Typography>
                            <ModalDetailsFeature type={1} />
                        </Box>
                    </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Box
                        display="flex"
                        flexDirection={"column"}
                        justifyContent="center"
                        alignItems="center"
                        sx={cardStyle}
                    >
                        <Box
                            display={"flex"}
                            alignItems={"flex-start"}
                            justifyContent={"space-between"}
                            width={"100%"}
                            height={"100%"}
                            px={1}
                            py={1}
                        >
                            <Typography
                                variant="h5"
                                component="h3"
                                marginLeft={2}
                                fontWeight={"bold"}
                                sx={{
                                    fontSize: {
                                        xs: "18px",
                                        md: "20px",
                                        lg: "24px"
                                    },
                                    color: isDark ? '#FFFFFF' : '#FFFFFF',
                                }}
                            >
                                Análisis Visual
                            </Typography>
                            <ModalDetailsFeature type={2} />
                        </Box>
                    </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 12 }}>
                    <Box
                        display="flex"
                        flexDirection={"column"}
                        justifyContent="center"
                        alignItems="center"
                        sx={cardStyle}
                    >
                        <Box
                            display={"flex"}
                            alignItems={"flex-start"}
                            justifyContent={"space-between"}
                            width={"100%"}
                            height={"100%"}
                            px={1}
                            py={1}
                        >
                            <Typography
                                variant="h5"
                                component="h3"
                                marginLeft={2}
                                fontWeight={"bold"}
                                sx={{
                                    fontSize: {
                                        xs: "18px",
                                        md: "20px",
                                        lg: "24px"
                                    },
                                    color: isDark ? '#FFFFFF' : '#FFFFFF',
                                }}
                            >
                                Análisis Funcional
                            </Typography>
                            <ModalDetailsFeature type={3} />
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </Grid >
    );
}
