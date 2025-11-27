import { type GenerateContentResponse, GoogleGenAI } from "@google/genai";

export class targetScanRepository {

    private static genAI: GoogleGenAI | undefined = undefined
    private static modelName: string = "gemini-2.5-flash";

    static async generateTextTargetScan(prompt: string): Promise<GenerateContentResponse> {

        if (prompt.trim() === "") {
            throw new Error("Prompt cannot be empty");
        }

        if (!this.genAI) {
            this.genAI = new GoogleGenAI({
                apiKey: import.meta.env.VITE_API_KEY_GEMINI || ""
            });
        }

        return await this.genAI.models.generateContent({
            model: this.modelName,
            contents: prompt
        });
    }
}