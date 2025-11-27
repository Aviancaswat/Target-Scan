import { Box } from "@mui/material";
import { lightBlue } from "@mui/material/colors";
import { useCallback, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import Navbar from "../components/chat/navbar";
import { ChatInput } from "../components/chat/textAreaCustom";
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
        async ({ text, files }: { text: string; files: File[] }) => {
            const question = text.trim();

            if (!question && files.length === 0) return;

            console.log("Sending question to AI:", question, files);

            const userMessage: Message = {
                role: "user",
                content: question || "[Usuario envió solo archivos]"
            };

            setMessages((prev) => [...prev, userMessage]);
            setQuestion("");

            try {
                const { text: aiText } = await AgentTargetScanService.getResponseIA(
                    question,
                    files
                );

                const assistantMessage: Message = {
                    role: "assistant",
                    content: aiText || "No response",
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
        },
        [question]
    );


    useEffect(() => {
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
                            borderRadius={8}
                            bgcolor={msg.role === "user" ? lightBlue[100] : "transparent"}
                            color={msg.role === "user" ? lightBlue[600] : "text.primary"}
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

            <ChatInput
                question={question}
                setQuestion={setQuestion}
                onSend={handleResponseIA}
            />
        </Box>
    );
};

export default ChatPage;
