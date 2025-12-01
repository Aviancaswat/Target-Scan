import AttachFileIcon from "@mui/icons-material/AttachFile";
import CodeIcon from "@mui/icons-material/Code";
import SendIcon from "@mui/icons-material/Send";
import {
    Box,
    Chip,
    IconButton,
    Stack,
    TextField,
    Tooltip,
} from "@mui/material";
import { type ChangeEvent, type DragEvent, type KeyboardEvent, useState } from "react";

interface ChatInputProps {
    question: string;
    setQuestion: (value: string) => void;
    onSend: (payload: { text: string; files: File[] }) => void;
}

export const ChatInput = ({ question, setQuestion, onSend }: ChatInputProps) => {
    const [files, setFiles] = useState<File[]>([]);
    const [isDragOver, setIsDragOver] = useState(false);

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleSend = () => {
        const trimmed = question.trim();
        if (!trimmed && files.length === 0) return;

        onSend({ text: trimmed, files });
        setQuestion("");
        setFiles([]);
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
        e.target.value = "";
    };

    const handleRemoveFile = (fileIndex: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== fileIndex));
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            setFiles((prev) => [...prev, ...Array.from(e.dataTransfer.files)]);
        }
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(true);
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
    };

    return (
        <Box width="90%" margin="auto" px={2} pb={2}>
            <Box
                mb={1}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                sx={{
                    border: isDragOver ? "2px dashed #1976d2" : "1px dashed #ccc",
                    borderRadius: 2,
                    padding: 1,
                    fontSize: 12,
                    textAlign: "center",
                    color: "#666",
                    transition: "all 0.2s ease",
                    bgcolor: isDragOver ? "rgba(25,118,210,0.04)" : "transparent",
                    cursor: "pointer",
                }}
            >
                Arrastra archivos aquí o usa el ícono de clip para adjuntarlos
            </Box>

            {files.length > 0 && (
                <Stack direction="row" spacing={1} flexWrap="wrap" mb={1}>
                    {files.map((file, index) => (
                        <Chip
                            key={`${file.name}-${index}`}
                            label={`${file.name} (${Math.round(file.size / 1024)} KB)`}
                            onDelete={() => handleRemoveFile(index)}
                            variant="outlined"
                            size="small"
                        />
                    ))}
                </Stack>
            )}

            <Box
                display="flex"
                alignItems="flex-end"
                gap={1}
                sx={{
                    border: "1px solid #ccc",
                    borderRadius: 2,
                    padding: 1,
                    bgcolor: "#fff",
                }}
            >
                <TextField
                    multiline
                    minRows={2}
                    maxRows={8}
                    placeholder="Escribe texto, pega código o describe qué quieres hacer..."
                    fullWidth
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e)}
                    variant="standard"
                    InputProps={{
                        disableUnderline: true,
                    }}
                />

                <input
                    id="chat-file-input"
                    type="file"
                    multiple
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                    autoFocus
                />

                <Stack direction="row" spacing={0.5} alignItems="center">
                    <Tooltip title="Marcar como código (opcional: usa ``` como en Markdown)">
                        <CodeIcon fontSize="small" />
                    </Tooltip>

                    <Tooltip title="Adjuntar archivos">
                        <label htmlFor="chat-file-input">
                            <IconButton component="span" size="small">
                                <AttachFileIcon fontSize="small" />
                            </IconButton>
                        </label>
                    </Tooltip>

                    <Tooltip title="Enviar (Enter) • Salto de línea (Shift + Enter)">
                        <span>
                            <IconButton
                                size="small"
                                onClick={handleSend}
                                disabled={!question.trim() && files.length === 0}
                            >
                                <SendIcon fontSize="small" />
                            </IconButton>
                        </span>
                    </Tooltip>
                </Stack>
            </Box>
        </Box>
    );
};
