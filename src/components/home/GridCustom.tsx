import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import ModalDetailsFeature from "./ModalDetailsFeature";

export default function GridCustom() {
    return (
        <Grid spacing={2} width={"80%"} className="animate__animated animate__fadeIn animate__delay-0.5s">
            <Grid container size={{ xs: 12, md: 6 }} spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Box
                        sx={{ bgcolor: "#79C3E8", borderRadius: 2, height: 100 }}
                        display="flex"
                        flexDirection={"column"}
                        justifyContent="center"
                        alignItems="center"
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
                        sx={{ bgcolor: "#EF7F74", borderRadius: 2, height: 100 }}
                        display="flex"
                        flexDirection={"column"}
                        justifyContent="center"
                        alignItems="center"
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
                        sx={{ bgcolor: "#4CBFB2", borderRadius: 2, height: 100 }}
                        display="flex"
                        flexDirection={"column"}
                        justifyContent="center"
                        alignItems="center"
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
        </Grid>
    );
}
