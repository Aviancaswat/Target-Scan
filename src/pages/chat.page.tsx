import { InputSelectedText } from "@/components/chat/InputSelectedText";
import { conversationCollection } from "@/firebase/firestore/collections/conversation.collection";
import { ConversationService } from "@/firebase/firestore/services/conversation.service";
import { AgentTargetScanService } from "@/services/targetScanService";
import '@/styles/chat.style.css';
import { ChatInput } from "@components/chat/textAreaCustom";
import WelcomeChat from "@components/chat/welcome-chat";
import type { Content } from "@google/genai";
import { Box, Fade, useTheme } from "@mui/material";
import { doc, onSnapshot } from "firebase/firestore";
import "highlight.js/styles/tokyo-night-dark.css";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { v4 as uuid } from "uuid";
import { MessageContainer } from "../components/chat/message-container";
import Navbar from "../components/chat/navbar";
import { useTargetScanStore, type ConversationsTargetScan, type Messages } from "../store/target-store";

const ChatPage = () => {
    const theme = useTheme();
    const {
        currentConversationId: conversationId,
        currentMessages: messages,
        setCurrentConversationId: setConversationId,
        setCurrentMessages: setMessages,
        setConversations,
        conversations
    } = useTargetScanStore();

    const [question, setQuestion] = useState<string>("");
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const messagesContainerRef = useRef<HTMLDivElement | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [statusStream, setStatusStream] = useState<boolean>(false);
    const [isNearBottom, setIsNearBottom] = useState<boolean>(true);
    const [positionInputSelectedText, setPositionInputSelectedText] = useState<{ top: string, left: string }>({ top: '0px', left: '0px' });
    const [selectedText, setSelectedText] = useState<string>("");

    const buildHistoryFromCurrentConversation = (
        conversationId: string,
        conversations: ConversationsTargetScan[]
    ): Content[] => {
        const conv = conversations.find(c => c.converdationId === conversationId);
        if (!conv) return [];
        return conv.messages.map(msg => ({
            role: msg.role,
            parts: [{ text: msg.message }]
        }));
    };

    const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({
                behavior,
                block: "end",
                inline: "nearest"
            });
        }
    }, []);

    const handleScroll = useCallback(() => {
        if (!messagesContainerRef.current) return;

        const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
        const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
        setIsNearBottom(distanceFromBottom < 100);
    }, []);

    const handleResponseIA = useCallback(
        async ({ text, files }: { text: string; files: File[] }) => {
            const questionText = text.trim();
            if (!questionText && files.length === 0) return;

            try {
                const userMessage: Messages = {
                    role: "user",
                    message: questionText,
                    timestamp: new Date().toISOString(),
                };

                setLoading(true);

                setMessages(prev => [...prev, userMessage]);

                setTimeout(() => scrollToBottom("smooth"), 50);

                await ConversationService.addMessage(conversationId!, userMessage);

                const conversation = await ConversationService.getConversation(conversationId!);
                if (!conversation?.title || conversation.title.trim() === "") {
                    await ConversationService.updateConversation(conversationId!, {
                        title: userMessage.message.slice(0, 100),
                    });
                }

                const stream = await AgentTargetScanService.getResponseIA(
                    buildHistoryFromCurrentConversation(conversationId!, conversations),
                    questionText,
                    files
                );

                setStatusStream(true);

                let assistantIndex = -1;
                setMessages(prev => {
                    assistantIndex = prev.length;
                    return [...prev, {
                        role: "model",
                        message: "",
                        timestamp: new Date().toISOString()
                    }];
                });

                let currentText = "";
                let firstChunk = true;

                for await (const chunk of stream) {
                    if (!chunk) continue;

                    if (firstChunk) {
                        setLoading(false);
                        firstChunk = false;
                    }

                    currentText += chunk;

                    setMessages(prev =>
                        prev.map((msg, i) =>
                            i === assistantIndex
                                ? { ...msg, message: currentText }
                                : msg
                        )
                    );
                }

                await ConversationService.addMessage(conversationId!, {
                    role: "model",
                    message: currentText,
                    timestamp: new Date().toISOString(),
                });

                setTimeout(() => setStatusStream(false), 300);

            } catch (error) {
                let userErrorMessage = "Ocurrió un error al procesar tu solicitud. Por favor, intenta nuevamente.";
                const technicalErrorMessage = (error as any)?.message || 'Mensaje de error no disponible.';
                const errorCode = (error as any)?.status || (error as any)?.code;

                if (errorCode) {

                    switch (errorCode) {
                        case 400:
                            userErrorMessage = "El cuerpo de la solicitud tiene un formato incorrecto. Por favor, verifica y vuelve a intentarlo.";
                            break;
                        case 403:
                            userErrorMessage = "Tu clave de API no tiene los permisos necesarios. Por favor, revisa la configuración de tu cuenta.";
                            break;
                        case 404:
                            userErrorMessage = "No se encontró un archivo de imagen, audio o video al que se hace referencia en tu solicitud. Por favor, verifica y vuelve a intentarlo.";
                            break;
                        case 429:
                            userErrorMessage = "Has alcanzado temporalmente el límite de solicitudes (cuota) permitido. Por favor, espera unos momentos para que se restablezca la cuota por minuto/hora.";
                            break;
                        case 500:
                            userErrorMessage = "El contexto de entrada es demasiado largo. Por favor, reduce la cantidad de información y vuelve a intentarlo.";
                            break;
                        case 503:
                            userErrorMessage = "El servicio de Target Scan está temporalmente sobrecargado. Espera unos minutos y vuelve a intentarlo.";
                            break;
                        case 504:
                            userErrorMessage = "Tu instrucción (o contexto) es demasiado grande para procesarse a tiempo. Por favor, reduce la cantidad de información y vuelve a intentarlo.";
                            break;
                        default:
                            userErrorMessage = `Ocurrió un error inesperado (Código: ${errorCode}). Por favor, contacta a soporte.`;
                    }
                }

                const errorMsg: Messages = {
                    role: "model",
                    message: userErrorMessage + ` (Detalle técnico: ${technicalErrorMessage})`,
                    timestamp: new Date().toISOString(),
                };

                await ConversationService.addMessage(conversationId!, errorMsg);
                console.error("Error fetching AI response:", error);

            } finally {
                setLoading(false);
                setStatusStream(false);
            }
        },
        [conversationId, conversations, scrollToBottom, setMessages]
    );

    const handleSendSelectedText = useCallback(async (prompt: string) => {
        if (!prompt.trim()) return;
        await handleResponseIA({ text: prompt, files: [] });
        setSelectedText("");
    }, [handleResponseIA]);

    const handleCloseSelectedText = useCallback(() => {
        setSelectedText("");
    }, []);

    const handleSelectedText = () => {

        let selection = window.getSelection();
        if (selection === null) return;

        let range = selection.getRangeAt(0);
        if (selection.toString().length > 0) {

            setSelectedText(selection.toString());
            let rect = range.getBoundingClientRect();

            const componentHeight = 300;
            const componentWidth = 450;
            const padding = 16;

            let top = rect.bottom + window.scrollY + 8;
            let left = rect.left + window.scrollX;

            if (rect.bottom + componentHeight > window.innerHeight) {
                top = rect.top + window.scrollY - componentHeight - 8;
            }

            if (left + componentWidth > window.innerWidth) {
                left = window.innerWidth - componentWidth - padding;
            }

            if (left < padding) {
                left = padding;
            }

            if (top < padding) {
                top = padding;
            }

            setPositionInputSelectedText({ top: `${top}px`, left: `${left}px` });
        } else {
            setSelectedText("");
        }
    }

    useLayoutEffect(() => {
        if (isNearBottom) {
            scrollToBottom("smooth");
        }
    }, [messages, isNearBottom, scrollToBottom]);

    useLayoutEffect(() => {
        if (messages.length > 0) {
            setTimeout(() => scrollToBottom("auto"), 100);
        }
    }, [conversationId]);

    useEffect(() => {
        const conversationUUID = uuid();
        setConversationId(conversationUUID);
    }, [setConversationId]);

    useEffect(() => {
        if (!conversationId) return;

        const ref = doc(conversationCollection, conversationId);

        const unsub = onSnapshot(ref, (snap) => {
            const data = snap.data();

            if (!data) return;

            const conversation: ConversationsTargetScan = {
                converdationId: conversationId,
                title: data.title ?? "Nuevo chat",
                messages: data.messages ?? [],
            };

            setMessages(conversation.messages);

            setConversations((prev) => {
                const exists = prev.some(c => c.converdationId === conversationId);

                if (!exists) {
                    return [...prev, conversation];
                }

                return prev.map(c =>
                    c.converdationId === conversationId ? conversation : c
                );
            });
        });

        return () => unsub();
    }, [conversationId, setMessages, setConversations]);

    useEffect(() => {
        const unsub = onSnapshot(conversationCollection, (snapshot) => {
            const convs = snapshot.docs.map((doc) => ({
                converdationId: doc.id,
                ...(doc.data() as Omit<ConversationsTargetScan, 'converdationId'>)
            })).sort((a, b) => {
                const dateA = a.updateAt ?? a.createAt ?? 0;
                const dateB = b.updateAt ?? b.createAt ?? 0;
                return dateB - dateA;
            });
            setConversations(() => convs);
        });

        return () => unsub();
    }, [setConversations]);

    return (
        <Box
            height="100dvh"
            display="flex"
            flexDirection="column"
            overflow="hidden"
            sx={{
                background: theme.palette.mode === 'dark'
                    ? 'linear-gradient(to bottom, #0a0a0a, #1a1a1a)'
                    : 'linear-gradient(to bottom, #f8f9fa, #ffffff)',
            }}
        >
            <Navbar />

            <Box
                ref={messagesContainerRef}
                flex={1}
                px={2}
                py={2}
                mt={8}
                onScroll={handleScroll}
                onMouseUp={handleSelectedText}
                sx={{
                    overflowX: "hidden",
                    overflowY: "auto",
                    scrollBehavior: "smooth",
                    position: "relative",
                    '&::-webkit-scrollbar': {
                        width: '8px',
                    },
                    '&::-webkit-scrollbar-track': {
                        background: 'transparent',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        background: theme.palette.mode === 'dark'
                            ? 'rgba(255,255,255,0.2)'
                            : 'rgba(0,0,0,0.2)',
                        borderRadius: '4px',
                        '&:hover': {
                            background: theme.palette.mode === 'dark'
                                ? 'rgba(255,255,255,0.3)'
                                : 'rgba(0,0,0,0.3)',
                        },
                    },
                }}
            >
                <Fade in timeout={600}>
                    <Box>
                        {messages.length === 0 ? (
                            <WelcomeChat />
                        ) : (
                            <MessageContainer
                                isLoading={loading}
                                messages={messages}
                                statusStream={statusStream}
                            />
                        )}
                        <div ref={messagesEndRef} />
                    </Box>
                </Fade>
            </Box>

            <Box
                sx={{
                    borderTop: theme.palette.mode === 'dark'
                        ? '1px solid rgba(255,255,255,0.1)'
                        : '1px solid rgba(0,0,0,0.1)',
                    bgcolor: theme.palette.mode === 'dark'
                        ? 'rgba(0,0,0,0.3)'
                        : 'rgba(255,255,255,0.8)',
                    backdropFilter: 'blur(10px)',
                    pt: 1,
                }}
            >
                <ChatInput
                    question={question}
                    setQuestion={setQuestion}
                    onSend={handleResponseIA}
                />
            </Box>

            <InputSelectedText
                selectedText={selectedText}
                position={positionInputSelectedText}
                getResponseAgent={handleSendSelectedText}
                onClose={handleCloseSelectedText}
            />
        </Box>
    );
};

export default ChatPage;