import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import { alpha, Box, Button, IconButton, Paper, TextField, useTheme } from "@mui/material";
import { useEffect, useState } from "react";

const valueDefault = "Explícame de manera sencilla el texto seleccionado."

interface InputSelectedTextProps {
    selectedText: string,
    position: {
        top: string,
        left: string
    },
    getResponseAgent?: (response: string) => void,
    onClose?: () => void
}

export const InputSelectedText: React.FC<InputSelectedTextProps> = (
    {
        selectedText,
        position,
        getResponseAgent,
        onClose
    }) => {
    const theme = useTheme();
    const [hidden, setHidden] = useState(true);
    const [prompt, setPrompt] = useState(valueDefault);

    useEffect(() => {
        if (selectedText && selectedText.trim().length > 0) {
            setHidden(false);
            setPrompt(valueDefault);
        }
        else {
            setHidden(true);
        }
    }, [selectedText])

    const handleSend = () => {
        if (getResponseAgent && prompt.trim()) {
            const fullPrompt = `${prompt}\n\nTexto seleccionado:\n"${selectedText}"`;
            getResponseAgent(fullPrompt);
            handleClose();
        }
    };

    const handleClose = () => {
        setHidden(true);
        if (onClose) {
            onClose();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleMouseUp = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    return (
        <Paper
            elevation={8}
            onMouseUp={handleMouseUp}
            sx={{
                width: "450px",
                maxWidth: "90vw",
                display: hidden ? "none" : "flex",
                flexDirection: "column",
                position: "fixed",
                top: position.top,
                left: position.left,
                zIndex: 10000,
                bgcolor: theme.palette.mode === 'dark' 
                    ? alpha(theme.palette.background.paper, 0.95)
                    : alpha(theme.palette.background.paper, 0.98),
                backdropFilter: 'blur(20px)',
                border: theme.palette.mode === 'dark'
                    ? `1px solid ${alpha(theme.palette.primary.main, 0.5)}`
                    : `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                borderRadius: 2,
                overflow: 'hidden',
                transform: 'translateY(8px)',
                boxShadow: theme.palette.mode === 'dark'
                    ? `0 8px 32px ${alpha(theme.palette.primary.main, 0.2)}, 0 4px 16px rgba(0,0,0,0.4)`
                    : undefined,
            }}
        >
            {/* Header con el texto seleccionado */}
            <Box
                sx={{
                    bgcolor: theme.palette.mode === 'dark'
                        ? alpha(theme.palette.primary.main, 0.2)
                        : alpha(theme.palette.primary.main, 0.08),
                    px: 2,
                    py: 1.5,
                    borderBottom: theme.palette.mode === 'dark'
                        ? `1px solid ${alpha(theme.palette.primary.main, 0.3)}`
                        : `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                <Box sx={{ flex: 1, mr: 1 }}>
                    <Box
                        sx={{
                            fontSize: '0.75rem',
                            color: theme.palette.text.secondary,
                            mb: 0.5,
                            fontWeight: 500,
                        }}
                    >
                        Texto seleccionado:
                    </Box>
                    <Box
                        sx={{
                            fontSize: '0.875rem',
                            color: theme.palette.text.primary,
                            maxHeight: '60px',
                            overflow: 'auto',
                            fontStyle: 'italic',
                            '&::-webkit-scrollbar': {
                                width: '4px',
                            },
                            '&::-webkit-scrollbar-thumb': {
                                background: alpha(theme.palette.text.secondary, 0.3),
                                borderRadius: '2px',
                            },
                        }}
                    >
                        "{selectedText}"
                    </Box>
                </Box>
                <IconButton
                    size="small"
                    onClick={handleClose}
                    sx={{
                        color: theme.palette.text.secondary,
                        '&:hover': {
                            bgcolor: alpha(theme.palette.error.main, 0.1),
                            color: theme.palette.error.main,
                        },
                    }}
                >
                    <CloseIcon fontSize="small" />
                </IconButton>
            </Box>

            {/* Input area */}
            <Box sx={{ p: 2 }}>
                <TextField
                    label="¿Qué quieres hacer con este texto?"
                    multiline
                    fullWidth
                    minRows={3}
                    maxRows={6}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={handleKeyDown}
                    variant="outlined"
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            bgcolor: theme.palette.mode === 'dark'
                                ? alpha(theme.palette.background.default, 0.5)
                                : alpha(theme.palette.background.default, 0.8),
                        },
                    }}
                    helperText="Presiona Ctrl+Enter para enviar"
                />
            </Box>

            {/* Actions */}
            <Box
                sx={{
                    px: 2,
                    pb: 2,
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: 1,
                }}
            >
                <Button
                    variant="outlined"
                    size="small"
                    onClick={handleClose}
                    sx={{
                        textTransform: 'none',
                        borderRadius: 1.5,
                    }}
                >
                    Cancelar
                </Button>
                <Button
                    variant="contained"
                    size="small"
                    onClick={handleSend}
                    disabled={!prompt.trim()}
                    endIcon={<SendIcon />}
                    sx={{
                        textTransform: 'none',
                        borderRadius: 1.5,
                        px: 2,
                    }}
                >
                    Enviar
                </Button>
            </Box>
        </Paper>
    )
}