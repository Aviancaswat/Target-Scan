import '@/pages/styles/chat.page.styles.css';
import { useTargetScanStore } from "@/store/target-store";
import GridCustom from "@components/home/GridCustom";
import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { ChevronRight, MessageCircleCode, Moon, Sun } from "lucide-react";
import { Link } from "react-router-dom";

const HomePage = () => {
    const theme = useTheme();
    const { themeMode, toggleTheme } = useTargetScanStore();
    const isDark = themeMode === 'dark';

    return (
        <Box
            width={"100%"}
            minHeight={"100dvh"}
            display="flex"
            flexDirection={"column"}
            alignItems={"center"}
            position="relative"
            sx={{
                background: isDark 
                    ? 'linear-gradient(to bottom, #0a0a0a 0%, #1a1a1a 100%)'
                    : '#f8fafc',
                justifyContent: {
                    xs: "normal",
                    lg: "center"
                },
                marginTop: {
                    xs: 5,
                    lg: 0
                }
            }}
        >
            {/* Theme Toggle Button */}
            <Box position="absolute" top={16} right={16} zIndex={10}>
                <IconButton
                    onClick={toggleTheme}
                    sx={{
                        color: 'text.primary',
                        bgcolor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                        '&:hover': {
                            bgcolor: 'primary.main',
                            color: 'primary.contrastText',
                            transform: 'rotate(180deg)',
                        },
                        transition: 'all 0.3s'
                    }}
                >
                    {isDark ? <Sun size={22} /> : <Moon size={22} />}
                </IconButton>
            </Box>

            {/* Grid Background */}
            <Box
                position="absolute"
                sx={{
                    inset: 0,
                    zIndex: 0,
                    backgroundImage: isDark
                        ? 'linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)'
                        : 'linear-gradient(to right, #e2e8f0 1px, transparent 1px), linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)',
                    backgroundSize: '20px 30px',
                    WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)',
                    maskImage: 'radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)',
                }}
            />

            <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                gap={2}
                position={"relative"}
                zIndex={2}
            >
                <MessageCircleCode 
                    size={48} 
                    color={isDark ? theme.palette.primary.light : theme.palette.primary.main}
                />
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
                        backgroundColor: isDark ? theme.palette.primary.main : "text.primary",
                        color: "#FFFFFF",
                        borderColor: isDark ? theme.palette.primary.main : "#000000",
                        "&:hover": {
                            backgroundColor: isDark ? theme.palette.primary.dark : "#333333",
                            borderColor: isDark ? theme.palette.primary.dark : "#333333",
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