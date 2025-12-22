import { create } from "zustand"

export type Messages = {
    role: "user" | "model"
    message: string,
    timestamp: string
}

export interface ConversationsTargetScan {
    converdationId: string
    title?: string
    messages: Messages[],
    createAt?: number,
    updateAt?: number
}

type TargetState = {
    conversations: ConversationsTargetScan[]
    currentConversationId: string | undefined
    currentMessages: Messages[],
    themeMode: 'light' | 'dark'
}

type TargetActions = {
    setConversations: (update: (data: ConversationsTargetScan[]) => ConversationsTargetScan[]) => void;
    setCurrentConversationId: (id: string) => void;
    setCurrentMessages: (
        messages: Messages[] | ((prev: Messages[]) => Messages[])
    ) => void;
    resetCurrentConversation: () => void;
    toggleTheme: () => void;
}

type TargetScanStore = TargetState & TargetActions;

const targetScanStore = create<TargetScanStore>()(
    (set) => ({
        conversations: [],
        currentConversationId: undefined,
        currentMessages: [],
        themeMode: (localStorage.getItem('themeMode') as 'light' | 'dark') || 'light',
        setConversations: (updater: (prev: ConversationsTargetScan[]) => ConversationsTargetScan[]) =>
            set((state) => ({
                conversations: updater(state.conversations),
            })),
        setCurrentConversationId: (id: string) => set({ currentConversationId: id }),
        setCurrentMessages: (updater) =>
            set((state) => ({
                currentMessages:
                    typeof updater === "function"
                        ? updater(state.currentMessages)
                        : updater,
            })),
        resetCurrentConversation: () => set({
            currentConversationId: undefined,
            currentMessages: []
        }),
        toggleTheme: () => set((state) => {
            const newMode = state.themeMode === 'light' ? 'dark' : 'light';
            localStorage.setItem('themeMode', newMode);
            return { themeMode: newMode };
        })
    })
);

export const useTargetScanStore = () => {
    const {
        conversations,
        currentConversationId,
        currentMessages,
        themeMode,
        resetCurrentConversation,
        setConversations,
        setCurrentConversationId,
        setCurrentMessages,
        toggleTheme,
    } = targetScanStore();

    return {
        conversations,
        currentConversationId,
        currentMessages,
        themeMode,
        resetCurrentConversation,
        setConversations,
        setCurrentConversationId,
        setCurrentMessages,
        toggleTheme,
    }
}