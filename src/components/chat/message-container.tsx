import { Box, CircularProgress, Icon, IconButton } from "@mui/material";
import { Check, Copy, Download, type LucideIcon } from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { toast } from "sonner";
import type { Messages } from "../../store/target-store";
import { getColor } from "../../utils/colors";
import { downloadFileMdToPdf } from "../../utils/download-response";

interface MessageContainerProps {
    messages: Messages[],
    isLoading: boolean,
    statusStream: boolean
}

export const MessageContainer: React.FC<MessageContainerProps> = ({ messages, isLoading, statusStream }) => {

    const [isDonwloadFile, setDownloadFile] = useState<boolean>(false);
    const [iconType, setIconCopy] = useState<LucideIcon>(Copy);
    const [userColors] = useState<[string, string]>(() => getColor());
    const [bgColor, textColor] = userColors;

    const handleCopy = async (content: string) => {
        await navigator.clipboard.writeText(content);
        setIconCopy(Check);
        setTimeout(() => {
            setIconCopy(Copy)
        }, 600)
    }

    const handleDownloadFile = async (content: string) => {
        try {
            setDownloadFile(true);
            await downloadFileMdToPdf(content);
            toast.success("El documento se ha descargado correctamente...");
        }
        catch (error) {
            console.log(`Error al descargar la respuesta: ${error}`)
            toast.error("Upps! Ha ocurrido un error al descargar la respuesta");
        }
        finally {
            setDownloadFile(false);
        }
    }

    return (
        <>
            {
                messages.map((msg, index) => {

                    const isUser = msg.role === "user";
                    const isLastMessage = index === messages.length - 1;
                    const showLoader = !isUser && isLastMessage && isLoading;

                    return (
                        <Box
                            key={`${msg.role}-${index}`}
                            display="flex"
                            justifyContent={isUser ? "flex-end" : "flex-start"}
                            mb={10}
                        >
                            <Box
                                maxWidth="80%"
                                px={1.5}
                                borderRadius={8}
                                bgcolor={isUser ? bgColor : "transparent"}
                                color={isUser ? textColor : "text.primary"}
                                sx={{ wordBreak: "break-word" }}
                            >
                                {isUser ? (
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm]}
                                        rehypePlugins={[rehypeRaw, rehypeHighlight]}
                                    >
                                        {msg.message}
                                    </ReactMarkdown>
                                ) : (
                                    <Box
                                        sx={{
                                            '& > *': {
                                                animation: isLastMessage && statusStream
                                                    ? 'fadeIn 0.3s ease-out'
                                                    : 'none',
                                            },
                                            '@keyframes fadeIn': {
                                                '0%': { opacity: 0.5 },
                                                '100%': { opacity: 1 },
                                            },
                                        }}
                                    >
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm]}
                                            rehypePlugins={[rehypeRaw, rehypeHighlight]}
                                        >
                                            {msg.message}
                                        </ReactMarkdown>
                                    </Box>
                                )}

                                {msg.role === "model" && statusStream === false && (
                                    <Box className="animate__animated animate__fadeIn">
                                        <IconButton
                                            size="small"
                                            sx={{ ml: 1 }}
                                            onClick={() => handleCopy(msg.message)}
                                        >
                                            <Icon component={iconType} fontSize="small" />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            sx={{ ml: 1 }}
                                            onClick={() => handleDownloadFile(msg.message)}
                                        >
                                            {
                                                isDonwloadFile ?
                                                    <CircularProgress size="small" /> :
                                                    <Icon component={Download} fontSize="small" />
                                            }
                                        </IconButton>
                                    </Box>
                                )}
                            </Box>

                            {showLoader && (
                                <Box ml={1} mt={1} mb={5} className="loader-model" />
                            )}
                        </Box>
                    );
                })
            }
        </>
    )
}