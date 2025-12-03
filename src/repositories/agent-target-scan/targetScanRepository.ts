import {
    GoogleGenAI,
    type Content,
    type ContentListUnion,
    type Part
} from "@google/genai";
import { PROMPT_TARGET_SCAN_MAIN } from "../../utils/prompt";

export class TargetScanRepository {
    private static genAI: GoogleGenAI | undefined;
    private static modelName: string = "gemini-2.5-flash";

    private static ensureClient() {
        if (!this.genAI) {
            const apiKey = import.meta.env.VITE_API_KEY_GEMINI || "";
            if (!apiKey) {
                throw new Error("VITE_API_KEY_GEMINI no es válida");
            }
            this.genAI = new GoogleGenAI({ apiKey });
        }
    }

    private static fileToBase64(file: File): Promise<{ base64: string; mimeType: string }> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const result = reader.result;
                if (typeof result !== "string") {
                    return reject(new Error("Tipo de resultado del archivo no válido"));
                }
                const [metadata, data] = result.split(",");
                const mimeMatch = metadata?.match(/data:(.*);base64/);
                const mimeType = mimeMatch?.[1] || file.type || "application/octet-stream";
                resolve({ base64: data, mimeType });
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    private static async filesToParts(files: File[]): Promise<Part[]> {
        const parts: Part[] = [];
        for (const file of files) {
            const { base64, mimeType } = await this.fileToBase64(file);
            parts.push({
                inlineData: { data: base64, mimeType }
            });
        }
        return parts;
    }

    static async *generateTextTargetScan(
        historyChat: Content[],
        userPrompt: string,
        files: File[] = []
    ): AsyncGenerator<string, void, unknown> {

        const trimmedPrompt = userPrompt.trim();
        if (!trimmedPrompt && files.length === 0) {
            throw new Error("User prompt and files cannot both be empty");
        }

        this.ensureClient();

        const fileParts = files.length > 0 ? await this.filesToParts(files) : [];

        const textParts: Part[] = [];
        if (trimmedPrompt) {
            textParts.push({ text: trimmedPrompt });
        }

        const userParts: Part[] = [
            ...textParts,
            ...fileParts
        ];

        if (userParts.length === 0) {
            throw new Error("Content for user must have at least one part");
        }

        const userContent: Content = {
            role: "user",
            parts: userParts
        };

        const contentsArray: Content[] = [
            ...historyChat,
            userContent
        ];

        const contents: ContentListUnion = contentsArray;

        const response = await this.genAI!.models.generateContentStream({
            model: this.modelName,
            contents,
            config: { systemInstruction: PROMPT_TARGET_SCAN_MAIN }
        });

        for await (const part of response) {
            const text = part.text ?? "";
            yield text;
        }
    }
}
