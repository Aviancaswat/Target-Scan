import { Box, Button, Typography } from "@mui/material";
import { ChevronRight, MessageCircleCode } from "lucide-react";
import { Link } from "react-router-dom";
import GridCustom from "../components/home/GridCustom";

const HomePage = () => {
    return (
        <Box
            width={"100%"}
            height={"100%"}
            display="flex"
            flexDirection={"column"}
            alignItems={"center"}
            sx={(theme) => ({
                justifyContent: {
                    xs: "normal",
                    lg: "center"
                },
                marginTop: {
                    xs: 5,
                    lg: 0
                },
                backgroundColor: "primary.main",
                backgroundImage: `linear-gradient(180deg, ${theme.palette.primary.main} 0%, rgba(255,255,255,1) 50%)`
            })}
        >
            <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                gap={2}
            >
                <MessageCircleCode size={48} />
                <Typography
                    variant="body1"
                    color={"text.secondary"}
                    sx={{
                        fontSize: {
                            xs: "14px",
                            md: "16px",
                            lg: "18px"
                        }
                    }}
                    className="animate__animated animate__fadeInDown"
                >
                    Comienza a explorar Target Scan
                </Typography>
                <Typography
                    variant="h4"
                    component="h1"
                    gutterBottom
                    fontWeight={"bold"}
                    textAlign={"center"}
                    sx={{
                        fontSize: {
                            xs: "24px",
                            sm: "24px",
                            md: "30px",
                            lg: "36px",
                        }
                    }}
                    className="animate__animated animate__fadeInDown"
                    color="text.primary"
                >
                    Automatiza el análisis técnico, visual y funcional
                </Typography>
            </Box>
            <Box>
                <Button
                    component={Link}
                    to="/chat"
                    variant="outlined"
                    sx={{
                        ml: 2,
                        textTransform: "none",
                        fontSize: "16px",
                        width: "auto",
                        backgroundColor: "text.primary",
                        color: "#FFFFFF",
                        borderColor: "#000000",
                        "&:hover": {
                            backgroundColor: "#333333",
                            borderColor: "#333333",
                        }
                    }}
                    endIcon={<ChevronRight />}
                >
                    Ir a Chat
                </Button>
            </Box>
            <br />
            <br />
            <GridCustom />
        </Box>
    )
}

export default HomePage;