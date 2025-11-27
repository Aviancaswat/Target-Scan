/// <reference types="vite/client" />

interface ImportMetaEnv {
    VITE_GITHUB_TOKEN: string
    VITE_API_KEY_GEMINI: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}