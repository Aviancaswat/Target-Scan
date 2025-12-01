import { Box, Typography } from "@mui/material";
import { MessageCircleCode } from "lucide-react";

const WelcomeChat = () => {
    return (
        <Box
            height={"100%"}
            display={"flex"}
            sx={{
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                gap: 2
            }}>
            <MessageCircleCode size={40} />
            <Typography
                variant="h4"
                textAlign={"center"}
                sx={{
                    fontSize: {
                        xs: "20px",
                        md: "28px",
                        lg: "30px"
                    }
                }}
            >
                Hola,👋
            </Typography>
            <Typography
                variant="h3"
                fontWeight={"bold"}
                textAlign={"center"}
                sx={{
                    fontSize: {
                        xs: "32px",
                        md: "36px",
                        lg: "42px"
                    }
                }}
            >
                ¿En que te puedo ayudar hoy?
            </Typography>
        </Box>
    )
}

export default WelcomeChat;