import { Box } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import Navbar from "../components/chat/navbar";
import { AgentTargetScanService } from "../services/targetScanService";

type Message = {
    role: "user" | "assistant";
    content: string;
};

const ChatPage = () => {
    const [question, setQuestion] = useState<string>("");
    const [messages, setMessages] = useState<Message[]>([]);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const handleResponseIA = useCallback(
        async (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
            if (event.key === "Enter" && !event.shiftKey && question.trim() !== "") {
                event.preventDefault();

                const userMessage: Message = { role: "user", content: question };
                setMessages((prev) => [...prev, userMessage]);
                setQuestion("");

                try {
                    const { text } = await AgentTargetScanService.getResponseIA(question);

                    const assistantMessage: Message = {
                        role: "assistant",
                        content: text || "No response",
                    };

                    setMessages((prev) => [...prev, assistantMessage]);
                } catch (error) {
                    const errorMessage: Message = {
                        role: "assistant",
                        content: "Ocurrió un error al procesar tu solicitud.",
                    };
                    setMessages((prev) => [...prev, errorMessage]);
                    console.error("Error fetching AI response:", error);
                }
            }
        },
        [question]
    );

    useEffect(() => {
        // Auto scroll al último mensaje
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
        }
    }, [messages]);

    return (
        <Box
            height="100vh"
            display="flex"
            flexDirection="column"
            overflow="hidden"
        >
            <Navbar />
            <Box
                flex={1}
                overflow="auto"
                px={2}
                py={2}
                mt={8}
            >
                {messages.map((msg, index) => (
                    <Box
                        key={index}
                        display="flex"
                        justifyContent={msg.role === "user" ? "flex-end" : "flex-start"}
                        mb={1.5}
                    >
                        <Box
                            maxWidth="80%"
                            px={1.5}
                            py={1}
                            borderRadius={2}
                            bgcolor={msg.role === "user" ? "primary.main" : "grey.200"}
                            color={msg.role === "user" ? "primary.contrastText" : "text.primary"}
                            boxShadow={1}
                            sx={{ wordBreak: "break-word" }}
                        >
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                rehypePlugins={[rehypeRaw, rehypeHighlight]}
                            >
                                {msg.content}
                            </ReactMarkdown>
                        </Box>
                    </Box>
                ))}
                <div ref={messagesEndRef} />
            </Box>

            <Box width="90%" px={2} pb={2} margin={"auto"} >
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
                        resize: "none",
                        margin: "auto"
                    }}
                    onKeyDown={handleResponseIA}
                    onChange={(e) => setQuestion(e.target.value)}
                    value={question}
                />
            </Box>
        </Box>
    );
};

export default ChatPage;
