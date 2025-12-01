import { Box, Icon, IconButton } from "@mui/material";
import "highlight.js/styles/tokyo-night-dark.css";
import { Check, Copy, type LucideIcon } from "lucide-react";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import Navbar from "../components/chat/navbar";
import { ChatInput } from "../components/chat/textAreaCustom";
import WelcomeChat from "../components/chat/welcome-chat";
import { AgentTargetScanService } from "../services/targetScanService";
import '../styles/chat.style.css';
import { getColor } from "../utils/colors";

type Message = {
    role: "user" | "assistant";
    content: string;
};

const ChatPage = () => {

    const [question, setQuestion] = useState<string>("");
    const [messages, setMessages] = useState<Message[]>([]);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [statusStream, setStatusStream] = useState<boolean>(false);
    const [iconCopy, setIconCopy] = useState<LucideIcon>(Copy);
    const [userColors] = useState<[string, string]>(() => getColor());
    const [bgColor, textColor] = userColors;

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
                setLoading(true);
                const response = await AgentTargetScanService.getResponseIA(
                    question,
                    files
                );

                let assistantIndex = -1;
                setMessages(prev => {
                    assistantIndex = prev.length;
                    return [...prev, { role: "assistant", content: "" }];
                });

                let responseModel = "";
                let isFirstPart = false;

                setStatusStream(true);
                for await (const part of response) {
                    if (!part) continue;

                    console.log("Part: ", part);

                    if (!isFirstPart) {
                        isFirstPart = true;
                        setLoading(false);
                    }

                    responseModel += part;

                    setMessages(prev =>
                        prev.map((msg, i) =>
                            i === assistantIndex
                                ? { ...msg, content: responseModel }
                                : msg
                        )
                    );
                }

                setTimeout(() => {
                    setStatusStream(false);
                }, 1000)

            } catch (error) {
                const errorMessage: Message = {
                    role: "assistant",
                    content: "Ocurrió un error al procesar tu solicitud.",
                };
                setMessages((prev) => [...prev, errorMessage]);
                console.error("Error fetching AI response:", error);
            }
            finally {
                setLoading(false);
                setStatusStream(false);
            }
        },
        [question]
    );

    const handleCopy = async (content: string) => {
        await navigator.clipboard.writeText(content);
        setIconCopy(Check);
        setTimeout(() => {
            setIconCopy(Copy)
        }, 1000)
    }

    useLayoutEffect(() => {
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
            className="animate__animated animate__fadeIn"
        >
            <Navbar />
            <Box
                flex={1}
                overflow="auto"
                px={2}
                py={2}
                mt={8}
            >
                {
                    messages.length === 0 ? (
                        <>
                            <WelcomeChat />
                        </>
                    ) : (

                        messages.map((msg, index) => {

                            const isUser = msg.role === "user";
                            const isLastMessage = index === messages.length - 1;
                            const showLoader = !isUser && isLastMessage && loading;

                            return (
                                <Box
                                    key={index}
                                    display="flex"
                                    justifyContent={msg.role === "user" ? "flex-end" : "flex-start"}
                                    mb={10}
                                >
                                    <Box
                                        maxWidth="80%"
                                        px={1.5}
                                        borderRadius={8}
                                        bgcolor={msg.role === "user" ? bgColor : "transparent"}
                                        color={msg.role === "user" ? textColor : "text.primary"}
                                        sx={{ wordBreak: "break-word" }}
                                    >
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm]}
                                            rehypePlugins={[rehypeRaw, rehypeHighlight]}
                                        >
                                            {msg.content}
                                        </ReactMarkdown>
                                        {
                                            msg.role === "assistant" && statusStream === false && (
                                                <Box className="animate__animated animate__fadeIn">
                                                    <IconButton size="small" sx={{ ml: 1 }} onClick={() => handleCopy(msg.content)}>
                                                        <Icon component={iconCopy} fontSize="small"/>
                                                    </IconButton>
                                                </Box>
                                            )
                                        }
                                    </Box>
                                    {
                                        showLoader && (
                                            <Box ml={1} mt={1} mb={5} className="loader-model" />
                                        )
                                    }
                                </Box>
                            )
                        }
                        )
                    )
                }
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
