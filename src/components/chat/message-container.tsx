import type { Messages } from "@/store/target-store";
import { useTargetScanStore } from "@/store/target-store";
import { getColor } from "@/utils/colors";
import { downloadFileMdToPdf } from "@/utils/download-response";
import { alpha, Box, CircularProgress, Icon, IconButton, useTheme } from "@mui/material";
import { Check, Copy, Download, type LucideIcon } from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { toast } from "sonner";
import { ThinkingLoaderText } from "./ThinkingLoaderText";

interface MessageContainerProps {
    messages: Messages[],
    isLoading: boolean,
    statusStream: boolean
}

export const MessageContainer: React.FC<MessageContainerProps> = ({ messages, isLoading, statusStream }) => {
    const theme = useTheme();
    const { themeMode } = useTargetScanStore();
    const isDark = themeMode === 'dark';

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
            toast.success("El documento se ha descargado correctamente...", {
                position: "top-left"
            });
        }
        catch (error) {
            console.error(`Error al descargar la respuesta: ${error}`)
            toast.error("Upps! Ha ocurrido un error al descargar la respuesta", {
                position: "top-left"
            });
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
                            <Box maxWidth="80%">
                                <Box
                                    px={1}
                                    py={isUser ? 0 : 2}
                                    borderRadius={3}
                                    bgcolor={isUser
                                        ? bgColor
                                        : isDark
                                            ? alpha('#1a1a1a', 0.8)
                                            : "secondary.dark"
                                    }
                                    color={isUser ? textColor : "text.primary"}
                                    sx={{
                                        wordBreak: "break-word",
                                        boxShadow: isUser
                                            ? `0 4px 12px ${bgColor}99`
                                            : isDark
                                                ? `0 4px 16px ${alpha('#000000', 0.5)}`
                                                : '0 2px 8px rgba(0, 0, 0, 0.1)',
                                        border: !isUser && isDark
                                            ? `1px solid ${alpha('#FFFFFF', 0.08)}`
                                            : 'none',
                                        backdropFilter: !isUser && isDark
                                            ? 'blur(10px)'
                                            : 'none',
                                        transition: 'all 0.2s ease',
                                    }}
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
                                </Box>
                                {msg.role === "model" && statusStream === false && (
                                    <Box pt={1} className="animate__animated animate__fadeIn" display="flex" gap={0.5}>
                                        <IconButton
                                            size="small"
                                            sx={{
                                                ml: 1,
                                                bgcolor: isDark
                                                    ? alpha('#1a1a1a', 0.6)
                                                    : alpha('#000000', 0.03),
                                                border: isDark
                                                    ? `1px solid ${alpha('#FFFFFF', 0.08)}`
                                                    : 'none',
                                                color: 'text.secondary',
                                                '&:hover': {
                                                    bgcolor: isDark
                                                        ? alpha('#2a2a2a', 0.8)
                                                        : alpha('#000000', 0.08),
                                                    color: theme.palette.primary.main,
                                                    transform: 'scale(1.1)',
                                                },
                                                transition: 'all 0.2s ease',
                                            }}
                                            onClick={() => handleCopy(msg.message)}
                                        >
                                            <Icon component={iconType} fontSize="small" />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            sx={{
                                                ml: 0.5,
                                                bgcolor: isDark
                                                    ? alpha('#1a1a1a', 0.6)
                                                    : alpha('#000000', 0.03),
                                                border: isDark
                                                    ? `1px solid ${alpha('#FFFFFF', 0.08)}`
                                                    : 'none',
                                                color: 'text.secondary',
                                                '&:hover': {
                                                    bgcolor: isDark
                                                        ? alpha('#2a2a2a', 0.8)
                                                        : alpha('#000000', 0.08),
                                                    color: theme.palette.primary.main,
                                                    transform: 'scale(1.1)',
                                                },
                                                transition: 'all 0.2s ease',
                                            }}
                                            onClick={() => handleDownloadFile(msg.message)}
                                        >
                                            {
                                                isDonwloadFile ?
                                                    <CircularProgress size={18} sx={{ color: 'text.secondary' }} /> :
                                                    <Icon component={Download} fontSize="small" />
                                            }
                                        </IconButton>
                                    </Box>
                                )}
                            </Box>

                            {showLoader && (
                                <Box ml={1} mt={1} mb={5}>
                                    <ThinkingLoaderText />
                                </Box>
                            )}
                        </Box>
                    );
                })
            }
        </>
    )
}