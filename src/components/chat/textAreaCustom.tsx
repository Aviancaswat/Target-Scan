import AttachFileIcon from "@mui/icons-material/AttachFile";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import {
    Box,
    Button,
    IconButton,
    Paper,
    Stack,
    TextField,
    Tooltip,
    Typography
} from "@mui/material";
import { ArrowUp, CodeIcon, X } from "lucide-react";
import {
    type ChangeEvent,
    type DragEvent,
    type KeyboardEvent,
    useEffect,
    useRef,
    useState,
} from "react";

interface ChatInputProps {
    question: string;
    setQuestion: (value: string) => void;
    onSend: (payload: { text: string; files: File[] }) => void;
}

type UploadItem = {
    file: File;
    preview?: string;
};

export const ChatInput = ({ question, setQuestion, onSend }: ChatInputProps) => {
    const [files, setFiles] = useState<UploadItem[]>([]);
    const [isDragOver, setIsDragOver] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const clearPreviews = (items: UploadItem[]) => {
        items.forEach((item) => {
            if (item.preview) URL.revokeObjectURL(item.preview);
        });
    };

    const handleSend = () => {
        const trimmed = question.trim();
        if (!trimmed && files.length === 0) return;

        onSend({
            text: trimmed,
            files: files.map((item) => item.file),
        });

        clearPreviews(files);
        setQuestion("");
        setFiles([]);

        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
        }
    };

    const mapFilesToUploadItems = (fileList: FileList | File[]) => {
        return Array.from(fileList).map((file) => ({
            file,
            preview: file.type.startsWith("image/")
                ? URL.createObjectURL(file)
                : undefined,
        }));
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;

        const mapped = mapFilesToUploadItems(e.target.files);
        setFiles((prev) => [...prev, ...mapped]);

        e.target.value = "";
    };

    const handleRemoveFile = (fileIndex: number) => {
        setFiles((prev) => {
            const copy = [...prev];
            const item = copy[fileIndex];
            if (item.preview) URL.revokeObjectURL(item.preview);
            copy.splice(fileIndex, 1);
            return copy;
        });
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const mapped = mapFilesToUploadItems(e.dataTransfer.files);
            setFiles((prev) => [...prev, ...mapped]);
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

    const adjustTextareaHeight = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    };

    useEffect(() => {
        adjustTextareaHeight();
    }, [question]);

    useEffect(() => {
        return () => {
            clearPreviews(files);
        };
    }, []);

    return (
        <Box width="90%" margin="auto" px={2} pb={2}>
            <Box
                mb={1}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                sx={(theme) => ({
                    border: isDragOver ? `2px dashed ${theme.palette.primary.main}` : "1px dashed #ccc",
                    borderRadius: 2,
                    padding: 1,
                    fontSize: 12,
                    textAlign: "center",
                    color: "#666",
                    transition: "all 0.2s ease",
                    bgcolor: isDragOver ? "rgba(25,118,210,0.04)" : "transparent",
                    cursor: "pointer",
                })}
            >
                Arrastra archivos aquí o usa el ícono de clip para adjuntarlos
            </Box>

            {files.length > 0 && (
                <Stack direction="row" spacing={1} flexWrap="wrap" mb={1} useFlexGap>
                    {files.map((item, index) => {
                        const { file, preview } = item;
                        const isImage = !!preview;

                        return (
                            <Paper
                                key={`${file.name}-${index}`}
                                sx={{
                                    position: "relative",
                                    width: 140,
                                    p: 1,
                                    borderRadius: 2,
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 0.5,
                                    boxShadow: 2,
                                    bgcolor: "background.paper",
                                }}
                            >
                                <IconButton
                                    size="small"
                                    onClick={() => handleRemoveFile(index)}
                                    sx={{
                                        position: "absolute",
                                        top: 4,
                                        right: 4,
                                        bgcolor: "rgba(0,0,0,0.4)",
                                        color: "white",
                                        "&:hover": {
                                            bgcolor: "rgba(0,0,0,0.7)",
                                        },
                                        zIndex: 1,
                                    }}
                                >
                                    <X size={14} />
                                </IconButton>

                                {isImage ? (
                                    <Box
                                        component="img"
                                        src={preview}
                                        alt={file.name}
                                        sx={{
                                            width: "100%",
                                            height: 80,
                                            borderRadius: 1,
                                            objectFit: "cover",
                                        }}
                                    />
                                ) : (
                                    <Box
                                        sx={{
                                            width: "100%",
                                            height: 80,
                                            borderRadius: 1,
                                            border: "1px dashed",
                                            borderColor: "divider",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <InsertDriveFileIcon fontSize="large" />
                                    </Box>
                                )}

                                <Typography
                                    variant="caption"
                                    noWrap
                                    title={file.name}
                                    sx={{ fontWeight: 500, color: "text.primary" }}
                                >
                                    {file.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {(file.size / 1024).toFixed(1)} KB
                                </Typography>
                            </Paper>
                        );
                    })}
                </Stack>
            )}

            <Box
                display="flex"
                alignItems="flex-end"
                gap={1}
                sx={(theme) => ({
                    border: `1px solid ${theme.palette.primary.main}`,
                    borderRadius: 2,
                    padding: 1,
                    bgcolor: "#fff",
                    position: "relative",
                })}
            >
                <TextField
                    inputRef={textareaRef}
                    multiline
                    minRows={3}
                    maxRows={10}
                    placeholder="Escribe texto, pega código o describe qué quieres hacer..."
                    fullWidth
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    onKeyDown={handleKeyDown}
                    variant="standard"
                    InputProps={{
                        disableUnderline: true,
                    }}
                    sx={{
                        '& .MuiInputBase-root': {
                            alignItems: 'flex-start',
                        },
                        '& textarea': {
                            overflow: 'auto !important',
                            resize: 'none',
                        }
                    }}
                />

                <input
                    id="chat-file-input"
                    type="file"
                    multiple
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                />

                <Stack direction="row" spacing={0.5} alignItems="center" flexShrink={0}>
                    <Tooltip title="Insertar bloque de código">
                        <Button
                            size="small"
                            onClick={() => {
                                const codeBlock = "```html\n// código aquí\n```";
                                const newValue = question + "\n" + codeBlock;
                                setQuestion(newValue);

                                setTimeout(() => {
                                    if (textareaRef.current) {
                                        const pos = newValue.indexOf("// código aquí");
                                        textareaRef.current.setSelectionRange(pos, pos + 14);
                                        textareaRef.current.focus();
                                    }
                                }, 0);
                            }}
                            sx={{
                                bgcolor: "black",
                                color: "white",
                                "&:hover": { bgcolor: "#333" },
                                textTransform: "none",
                                padding: "6px 16px",
                                borderRadius: "16px",
                                fontWeight: 600,
                                fontSize: "0.875rem",
                                boxShadow: "none",
                                whiteSpace: 'nowrap'
                            }}
                            startIcon={<CodeIcon fontSize="small" />}
                        >
                            Insertar código
                        </Button>
                    </Tooltip>

                    <Tooltip title="Adjuntar archivos">
                        <label htmlFor="chat-file-input">
                            <Button
                                component="span"
                                size="small"
                                sx={{
                                    backgroundColor: "primary.main",
                                    color: "text.primary",
                                    textTransform: "none",
                                    '&:hover': {
                                        color: "text.primary",
                                        boxShadow: "0px 4px 15px rgba(255, 0, 0, 0.4)",
                                    },
                                    padding: "6px 16px",
                                    borderRadius: "16px",
                                    fontWeight: 600,
                                    fontSize: "0.875rem",
                                    boxShadow: "none",
                                    whiteSpace: 'nowrap',
                                }}
                                startIcon={<AttachFileIcon fontSize="small" />}
                            >
                                Adjuntar
                            </Button>
                        </label>
                    </Tooltip>

                    <Tooltip title="Enviar (Enter) • Salto de línea (Shift + Enter)">
                        <span>
                            <IconButton
                                size="small"
                                onClick={handleSend}
                                disabled={!question.trim() && files.length === 0}
                                sx={{
                                    bgcolor: "black",
                                    color: "#FFFFFF",
                                    "&:hover": {
                                        background: "#3e3e3eff",
                                        color: "#ffffff",
                                    },
                                    "&:disabled": {
                                        bgcolor: "grey.300",
                                        color: "grey.500",
                                    }
                                }}
                            >
                                <ArrowUp size={18} />
                            </IconButton>
                        </span>
                    </Tooltip>
                </Stack>
            </Box>
        </Box>
    );
};