import { Box, Typography } from "@mui/material";
import { useCallback, useState } from "react";
import ReactMarkdown from "react-markdown";
import Navbar from "../components/chat/navbar";
import { AgentTargetScanService } from "../services/targetScanService";

const ChatPage = () => {

    const [response, setResponse] = useState<string>("");
    const [question, setQuestion] = useState<string>("");

    const handleResponseIA = useCallback(async (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === "Enter" && !event.shiftKey) {
            console.log("Entrando al handleResponseIA");
            event.preventDefault();
            const input = event.currentTarget.value;
            console.log("Input del usuario:", input);
            setQuestion(input);
            const { text } = await AgentTargetScanService.getResponseIA(input)
            setResponse(text || "No response");
            console.log("Respuesta de la IA:", text);
            event.currentTarget.value = "";
        }
    }, [question])

    return (
        <>
            <Navbar />
            <Box
                height={"75%"}
                flex={1}
                p={2}
                overflow="auto"
            >
                <Typography variant="h4" gutterBottom>
                    Chat Page
                </Typography>
                <Typography variant="body1">
                    <ReactMarkdown>{response}</ReactMarkdown>
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
                    onKeyDown={handleResponseIA}
                />
            </Box>
        </>
    )
}

export default ChatPage;