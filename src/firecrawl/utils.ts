
const FIRECRAWL_API = "https://api.firecrawl.dev/v2/scrape";
const scrapeURL = async (url: string): Promise<string> => {
    const res = await fetch(FIRECRAWL_API, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${import.meta.env.VITE_API_KEY_FIRECRAWL}`
        },
        body: JSON.stringify({
            url,
            formats: ["markdown", "html"],
            timeout: 30000,
        })
    });

    const data = await res.json();
    console.log("Firecrawl scrape response data:", data);
    return data?.data?.markdown || data?.markdown || "No se pudo extraer contenido legible.";
}

export { scrapeURL };

