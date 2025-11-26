import { Box, Typography } from "@mui/material";
import Navbar from "../components/chat/navbar";

const ChatPage = () => {
    return (
        <>
            <Navbar />
            <Box
                height={"75%"}
                flex={1}
                p={2}
                overflow="auto"
            >
                <Typography variant="h4">
                    Chat Page
                </Typography>
            </Box>
            <Box
                width={"90%"}
                margin={"auto"}
            >
                <textarea
                    placeholder="Escribe cualquier cosa..."
                    style={{
                        width: "100%",
                        height: "100px",
                        borderRadius: "8px",
                        padding: "10px",
                        fontSize: "16px",
                        border: "1px solid #ccc",
                        boxSizing: "border-box",
                    }}
                />
            </Box>
        </>
    )
}

export default ChatPage;