import type { Content } from "@google/genai";
import { Box, Fade, useTheme } from "@mui/material";
import { doc, onSnapshot } from "firebase/firestore";
import "highlight.js/styles/tokyo-night-dark.css";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { v4 as uuid } from "uuid";
import { MessageContainer } from "../components/chat/message-container";
import Navbar from "../components/chat/navbar";
import { ChatInput } from "../components/chat/textAreaCustom";
import WelcomeChat from "../components/chat/welcome-chat";
import { conversationCollection } from "../firebase/firestore/collections/conversation.collection";
import { ConversationService } from "../firebase/firestore/services/conversation.service";
import { AgentTargetScanService } from "../services/targetScanService";
import { useTargetScanStore, type ConversationsTargetScan, type Messages } from "../store/target-store";
import '../styles/chat.style.css';

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
                const errorMsg: Messages = {
                    role: "model",
                    message: "Ocurrió un error al procesar tu solicitud. Por favor, intenta nuevamente.",
                    timestamp: new Date().toISOString(),
                };

                setMessages(prev => [...prev, errorMsg]);
                await ConversationService.addMessage(conversationId!, errorMsg);

                console.error("Error fetching AI response:", error);

            } finally {
                setLoading(false);
                setStatusStream(false);
            }
        },
        [conversationId, conversations, scrollToBottom, setMessages]
    );

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
            }));
            setConversations(() => convs);
        });

        return () => unsub();
    }, [setConversations]);

    return (
        <Box
            height="100vh"
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
        </Box>
    );
};

export default ChatPage;