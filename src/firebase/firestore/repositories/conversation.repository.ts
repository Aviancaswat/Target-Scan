import { addDoc, arrayUnion, deleteDoc, doc, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import type { Messages } from "../../../store/target-store";
import { conversationCollection } from "../collections/conversation.collection";
import type { ChatMessage } from "../types/conversation.type";

export const coversationRepository = {
    async getAll(): Promise<ChatMessage[]> {
        const snapShots = await getDocs(conversationCollection);
        return snapShots.docs.map(doc => {
            const dataChat = doc.data();
            return {
                converdationId: dataChat.converdationId,
                title: dataChat.title,
                messages: dataChat.messages
            } as ChatMessage;
        })
    },

    async create(conversation: ChatMessage) {
        return await addDoc(conversationCollection, conversation);
    },

    async update(id: string, data: Partial<ChatMessage>) {
        const ref = doc(conversationCollection, id);
        return await updateDoc(ref, data);
    },

    async delete(id: string) {
        const ref = doc(conversationCollection, id);
        return await deleteDoc(ref);
    },

    async addMessage(conversationId: string, message: Messages) {
        const ref = doc(conversationCollection, conversationId);

        return await setDoc(
            ref,
            {
                messages: arrayUnion(message),
                converdationId: conversationId,
            },
            { merge: true }
        );
    },

    async getById(conversationId: string): Promise<ChatMessage | null> {
        const ref = doc(conversationCollection, conversationId);
        const snap = await getDoc(ref);

        if (!snap.exists()) return null;

        const data = snap.data();

        return {
            converdationId: conversationId,
            title: data.title ?? "",
            messages: data.messages ?? []
        } as ChatMessage;
    }

}