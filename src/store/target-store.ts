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
    fullHeightInputChat: boolean
}

type TargetActions = {
    setConversations: (update: (data: ConversationsTargetScan[]) => ConversationsTargetScan[]) => void;
    setCurrentConversationId: (id: string) => void;
    setCurrentMessages: (
        messages: Messages[] | ((prev: Messages[]) => Messages[])
    ) => void;
    resetCurrentConversation: () => void;
    setFullHeightInputChat: (newState: boolean) => void
}

type TargetScanStore = TargetState & TargetActions;

const targetScanStore = create<TargetScanStore>()(
    (set) => ({
        conversations: [],
        currentConversationId: undefined,
        currentMessages: [],
        fullHeightInputChat: false,
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
        setFullHeightInputChat: (newState) => set({
            fullHeightInputChat: newState
        })
    })
);

export const useTargetScanStore = () => {
    const {
        conversations,
        currentConversationId,
        currentMessages,
        fullHeightInputChat,
        resetCurrentConversation,
        setConversations,
        setCurrentConversationId,
        setCurrentMessages,
        setFullHeightInputChat
    } = targetScanStore();

    return {
        conversations,
        currentConversationId,
        currentMessages,
        fullHeightInputChat,
        resetCurrentConversation,
        setConversations,
        setCurrentConversationId,
        setCurrentMessages,
        setFullHeightInputChat
    }
}