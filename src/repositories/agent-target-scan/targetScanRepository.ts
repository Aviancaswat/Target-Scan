import { scrapeURL } from "@/firecrawl/utils";
import { firecrawlTool } from "@/tools/tools";
import {
    ApiError,
    FunctionCallingConfigMode,
    GoogleGenAI,
    type Content,
    type ContentListUnion,
    type Part
} from "@google/genai";
import { PROMPT_TARGET_SCAN_MAIN } from "../../utils/prompt";

export class TargetScanRepository {
    private static genAI: GoogleGenAI | undefined;
    private static modelName: string = "gemini-2.5-pro";
    // private static modelName = "gemini-2.5-flash";

    private static ensureClient() {
        if (!this.genAI) {
            const apiKey = import.meta.env.VITE_API_KEY_GEMINI || "";
            if (!apiKey) {
                throw new Error("VITE_API_KEY_GEMINI no es válida");
            }

            this.genAI = new GoogleGenAI({
                apiKey: apiKey,
            });
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

        try {

            const trimmedPrompt = userPrompt.trim();
            if (!trimmedPrompt && files.length === 0) {
                throw new Error("El prompt del usuario no puede estar vacío.");
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
                throw new Error("el contenido del usuario no puede estar vacío.");
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

            // const groundingTool: Tool = {
            //     googleSearch: {},
            //     functionDeclarations: CustomTools.functionDeclarations
            // };

            const response = await this.genAI!.models.generateContentStream({
                model: this.modelName,
                contents,
                config: {
                    systemInstruction: PROMPT_TARGET_SCAN_MAIN,
                    tools: [
                        {
                            functionDeclarations: [firecrawlTool]
                        }
                    ],
                    toolConfig: {
                        functionCallingConfig: {
                            mode: FunctionCallingConfigMode.ANY,
                            allowedFunctionNames: ["get_url_content"]
                        }
                    }
                }
            });

            for await (const part of response) {
                if (part.functionCalls && part.functionCalls.length > 0) {
                    const functionCall = part.functionCalls[0];
                    console.log(`Function to call: ${functionCall.name}`);
                    console.log(`Arguments: ${JSON.stringify(functionCall.args)}`);
                    const args = functionCall.args as { url: string };

                    if (args.url && args.url.trim() !== "") {

                        const result = await scrapeURL(args.url);
                        console.log("Scraped content:", result);

                        const responseAgent = `Contenido extraído de la URL ${args.url}:\n\n${result || "No se pudo extraer contenido legible."}\n\nFin del contenido extraído.\n`;
                        console.log("Response Agent URL firecrawl:", responseAgent);

                        const analizeResponse = await this.genAI!.models.generateContentStream({
                            model: this.modelName,
                            contents: [
                                {
                                    parts: [{ text: responseAgent }]
                                }
                            ],
                            config: {
                                systemInstruction: `Analiza el siguiente contenido extraído de una URL y 
                                proporciona un resumen o la información solicitada por el usuario. 
                                La pregunta del usuario es: ${userPrompt}.`,
                            }
                        });

                        for await (const analizePart of analizeResponse) {
                            const text = analizePart.text ?? "";
                            yield text;
                        }
                    }
                } else {
                    console.log("No function call found in the response.");
                    console.log(part.text);
                }

                const text = part.text ?? "";
                yield text;
            }

        } catch (error) {

            const isServiceUnavailable = error instanceof ApiError && error.status === 503;
            const isRateLimit = error instanceof ApiError && error.status === 429;
            if (isServiceUnavailable || isRateLimit) {
                console.error("El servicio de target Scan  no está disponible en este momento. Por favor, intenta nuevamente más tarde.");
            }
            throw error;
        }
    }
}
