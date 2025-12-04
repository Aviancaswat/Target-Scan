import { alpha, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import imagePattern from "../../assets/patternOne.png";
import ModalDetailsFeature from "./ModalDetailsFeature";

export default function GridCustom() {
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
                        sx={(theme) => ({
                            borderRadius: 2,
                            height: 100,
                            backgroundImage: `
                                    linear-gradient(
                                    ${alpha(theme.palette.primary.main, 0.75)},
                                    ${alpha(theme.palette.primary.main, 0.75)}
                                    ),
                                    url(${imagePattern})
                                    `,
                            backgroundPosition: "center",
                            backgroundRepeat: "no-repeat",
                            backgroundSize: "cover"
                        })}
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
                                color="secondary.main"
                                sx={{
                                    fontSize: {
                                        xs: "18px",
                                        md: "20px",
                                        lg: "24px"
                                    }
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
                        sx={(theme) => ({
                            borderRadius: 2,
                            height: 100,
                            backgroundImage: `
                                    linear-gradient(
                                    ${alpha(theme.palette.primary.main, 0.75)},
                                    ${alpha(theme.palette.primary.main, 0.75)}
                                    ),
                                    url(${imagePattern})
                                    `,
                            backgroundPosition: "center",
                            backgroundRepeat: "no-repeat",
                            backgroundSize: "cover"
                        })}
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
                                color="secondary.main"
                                sx={{
                                    fontSize: {
                                        xs: "18px",
                                        md: "20px",
                                        lg: "24px"
                                    }
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
                        sx={(theme) => ({
                            borderRadius: 2,
                            height: 100,
                            backgroundImage: `
                                    linear-gradient(
                                    ${alpha(theme.palette.primary.main, 0.75)},
                                    ${alpha(theme.palette.primary.main, 0.75)}
                                    ),
                                    url(${imagePattern})
                                    `,
                            backgroundPosition: "center",
                            backgroundRepeat: "no-repeat",
                            backgroundSize: "cover"
                        })}
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
                                color="secondary.main"
                                sx={{
                                    fontSize: {
                                        xs: "18px",
                                        md: "20px",
                                        lg: "24px"
                                    }
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
