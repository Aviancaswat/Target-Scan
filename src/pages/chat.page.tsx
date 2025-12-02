import type { Content } from "@google/genai";
import { Box } from "@mui/material";
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
    const [loading, setLoading] = useState<boolean>(false);
    const [statusStream, setStatusStream] = useState<boolean>(false);

    const buildHistoryFromCurrentConversation = (conversationId: string, conversations: ConversationsTargetScan[]): Content[] => {
        const conv = conversations.find(c => c.converdationId === conversationId);
        if (!conv) return [];
        return conv.messages.map(msg => ({
            role: msg.role,
            parts: [{ text: msg.message }]
        }));
    };


    const handleResponseIA = useCallback(
        async ({ text, files }: { text: string; files: File[] }) => {

            const question = text.trim();
            if (!question && files.length === 0) return;

            try {

                const userMessage: Messages = {
                    role: "user",
                    message: question,
                    timestamp: new Date().toISOString(),
                };

                setLoading(true);
                await ConversationService.addMessage(conversationId!, userMessage);
                const conversation = await ConversationService.getConversation(conversationId!);
                if (!conversation?.title || conversation.title.trim() === "") {
                    await ConversationService.updateConversation(conversationId!, {
                        title: userMessage.message.slice(0, 400),
                    });
                }


                const stream = await AgentTargetScanService.getResponseIA(buildHistoryFromCurrentConversation(conversationId!, conversations), question, files);

                setStatusStream(true);

                let assistantIndex = -1;
                setMessages(prev => {
                    assistantIndex = prev.length;
                    return [...prev, { role: "model", message: "", timestamp: new Date().toISOString() }];
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
                    message: "Ocurrió un error al procesar tu solicitud.",
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
        [question, conversationId]
    );

    useLayoutEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
        }
    }, [messages]);

    useEffect(() => {
        const conversationUUID = uuid();
        setConversationId(conversationUUID);
    }, [])

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
    }, [conversationId]);

    useEffect(() => {

        const listenConversations = () => {

            return onSnapshot(conversationCollection, (snapshot) => {
                const convs = snapshot.docs.map((doc) => ({
                    converdationId: doc.id,
                    ...(doc.data() as any)
                }));
                setConversations(() => [...convs]);
            });
        }
        listenConversations();
    }, [])

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
                px={2}
                py={2}
                mt={8}
                sx={{
                    overflowX: "hidden",
                    overflowY: "auto"
                }}
            >
                {
                    messages.length === 0 ? (
                        <>
                            <WelcomeChat />
                        </>
                    ) : (
                        <MessageContainer
                            isLoading={loading}
                            messages={messages}
                            statusStream={statusStream}
                        />
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