import { useTargetScanStore } from "@/store/target-store";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import {
    alpha,
    Box,
    Button,
    IconButton,
    Paper,
    Stack,
    TextField,
    Tooltip,
    Typography,
    useTheme
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
import { toast } from "sonner";

interface ChatInputProps {
    question: string;
    setQuestion: (value: string) => void;
    onSend: (payload: { text: string; files: File[] }) => void;
}

type UploadItem = {
    file: File;
    preview?: string;
};

const MIME_TYPES_AVAILABLE_MODEL_GEMINI = [
    'image/png',
    'image/jpeg',
    'image/webp'
]

export const ChatInput = ({ question, setQuestion, onSend }: ChatInputProps) => {
    const theme = useTheme();
    const { themeMode } = useTargetScanStore();
    const isDark = themeMode === 'dark';
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

    const validateMimeTypeImages = (arrayFiles: UploadItem[] = []): UploadItem[] => {
        if (!arrayFiles.length) return [];
        const validFiles = arrayFiles.filter(e =>
            MIME_TYPES_AVAILABLE_MODEL_GEMINI.includes(e.file.type)
        );
        const inValidFiles = arrayFiles.filter(e =>
            !MIME_TYPES_AVAILABLE_MODEL_GEMINI.includes(e.file.type)
        );

        if (inValidFiles.length) {
            const formatsAvailable = "png, jpeg y webp";
            inValidFiles.forEach(e => {
                toast.error(
                    `El archivo ${e.file.name} tiene un formato no admitido. 
                    Solo se permiten archivos: ${formatsAvailable}`,
                    {
                        duration: 10000,
                        closeButton: true
                    }
                )
            })
        }

        return validFiles;
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const mapped = mapFilesToUploadItems(e.target.files);
        const validFiles = validateMimeTypeImages(mapped);
        if (validFiles.length === 0) return;
        setFiles(prev => [...prev, ...validFiles]);
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
            const validateFiles = validateMimeTypeImages(mapped);
            if (validateFiles.length === 0) return;
            setFiles((prev) => [...prev, ...validateFiles]);
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
        const el = textareaRef.current;
        if (!el) return;
        const lineHeight = parseInt(window.getComputedStyle(el).lineHeight, 10);
        const maxHeight = lineHeight * 8;
        el.style.height = "auto";
        el.style.height = Math.min(el.scrollHeight, maxHeight) + "px";
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
                sx={{
                    display: "grid",
                    placeContent: "center",
                    border: isDragOver 
                        ? `2px dashed ${theme.palette.primary.main}` 
                        : isDark
                            ? `1px dashed ${alpha('#FFFFFF', 0.2)}`
                            : "1px dashed #ccc",
                    borderRadius: 2,
                    padding: 1,
                    fontSize: 12,
                    textAlign: "center",
                    color: isDark ? alpha('#FFFFFF', 0.6) : "#666",
                    bgcolor: isDragOver 
                        ? alpha(theme.palette.primary.main, 0.1)
                        : "transparent",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                }}
            >
                Arrastra archivos aquí o usa el botón de adjuntar
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
                                    boxShadow: isDark
                                        ? `0 2px 8px ${alpha('#000000', 0.6)}`
                                        : 2,
                                    bgcolor: isDark
                                        ? alpha('#1a1a1a', 0.8)
                                        : "background.paper",
                                    border: isDark
                                        ? `1px solid ${alpha('#FFFFFF', 0.1)}`
                                        : 'none',
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
                flexDirection={"column"}
                alignItems="flex-end"
                gap={1}
                sx={{
                    border: `1.5px solid ${theme.palette.primary.main}`,
                    borderRadius: 2.5,
                    padding: 1.5,
                    bgcolor: isDark
                        ? alpha('#0a0a0a', 0.6)
                        : "#fff",
                    position: "relative",
                    backdropFilter: isDark ? 'blur(10px)' : 'none',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                        boxShadow: isDark
                            ? `0 0 0 1px ${alpha(theme.palette.primary.main, 0.3)}`
                            : `0 0 0 1px ${alpha(theme.palette.primary.main, 0.15)}`,
                    },
                    '&:focus-within': {
                        boxShadow: isDark
                            ? `0 0 0 2px ${alpha(theme.palette.primary.main, 0.4)}`
                            : `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
                    }
                }}
            >
                <TextField
                    inputRef={textareaRef}
                    multiline
                    minRows={3}
                    maxRows={6}
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
                            color: 'text.primary',
                        },
                        '& textarea': {
                            overflow: 'auto !important',
                            resize: 'none',
                            '&::placeholder': {
                                color: isDark
                                    ? alpha('#FFFFFF', 0.4)
                                    : alpha('#000000', 0.5),
                                opacity: 1,
                            }
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
                                bgcolor: isDark
                                    ? alpha('#1a1a1a', 0.9)
                                    : "black",
                                color: "white",
                                border: isDark
                                    ? `1px solid ${alpha('#FFFFFF', 0.15)}`
                                    : 'none',
                                "&:hover": { 
                                    bgcolor: isDark
                                        ? alpha('#2a2a2a', 0.9)
                                        : "#333",
                                    transform: 'translateY(-1px)',
                                    boxShadow: isDark
                                        ? `0 4px 12px ${alpha('#000000', 0.5)}`
                                        : 'none',
                                },
                                textTransform: "none",
                                padding: "6px 16px",
                                borderRadius: "16px",
                                fontWeight: 600,
                                fontSize: "0.875rem",
                                boxShadow: "none",
                                whiteSpace: 'nowrap',
                                transition: 'all 0.2s ease',
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
                                    color: "secondary.main",
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
                                    bgcolor: isDark
                                        ? alpha('#1a1a1a', 0.9)
                                        : "black",
                                    color: "#FFFFFF",
                                    border: isDark
                                        ? `1px solid ${alpha('#FFFFFF', 0.15)}`
                                        : 'none',
                                    "&:hover": {
                                        bgcolor: isDark
                                            ? alpha('#2a2a2a', 0.9)
                                            : "#3e3e3eff",
                                        transform: 'translateY(-1px)',
                                        boxShadow: isDark
                                            ? `0 4px 12px ${alpha('#000000', 0.5)}`
                                            : 'none',
                                    },
                                    "&:disabled": {
                                        bgcolor: isDark
                                            ? alpha('#FFFFFF', 0.05)
                                            : "grey.300",
                                        color: isDark
                                            ? alpha('#FFFFFF', 0.25)
                                            : "grey.500",
                                        border: 'none',
                                    },
                                    transition: 'all 0.2s ease',
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