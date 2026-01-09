import { Type } from "@google/genai";

const firecrawlTool = {
    name: "get_url_content",
    description: "Accede a una URL para leer, extraer y analizar su contenido en tiempo real. Úsala cuando el usuario proporcione un enlace o necesites información actualizada de un sitio web específico.",
    parameters: {
        type: Type.OBJECT,
        properties: {
            url: {
                type: Type.STRING,
                description: "La dirección web (URL) completa de donde se extraerá la información."
            }
        },
        required: ["url"]
    }
};

export { firecrawlTool };

