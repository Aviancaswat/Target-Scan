import { ConversationService } from "@/firebase/firestore/services/conversation.service";
import CloseIcon from "@mui/icons-material/Close";
import {
    Box,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    MenuItem,
    TextField,
    Typography
} from "@mui/material";
import { Pen, Pencil } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const ModalUpdateChatName = ({ conversationId }: { conversationId: string }) => {
    const [open, setOpen] = useState(false);
    const [newChatName, setNewChatName] = useState("");

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setNewChatName("");
        setOpen(false);
    };

    const handleChangeNameChat = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key !== "Enter" || e.shiftKey) return;

        if (!newChatName.trim()) return;

        try {
            await ConversationService.updateConversation(conversationId, {
                title: newChatName.trim()
            });

            toast.success("Chat cambiado", {
                description: "El nombre del chat se ha cambiado con éxito",
                position: "top-right"
            });

            handleClose();
        } catch (error) {
            console.error("Error cambiando nombre del chat:", error);
            toast.error("No se pudo cambiar el nombre del chat", {
                position: "top-right"
            });
        }
    };

    return (
        <>
            <MenuItem
                onClick={handleOpen}
                sx={{
                    fontSize: "14px",
                    display: "flex",
                    gap: 1.5,
                    py: 1.5,
                    px: 2,
                    transition: 'all 0.2s',
                    borderRadius: 1,
                    "&:hover": {
                        background: 'rgba(230, 57, 70, 0.1)',
                        color: "primary.main",
                        transform: 'translateX(4px)',
                    }
                }}
            >
                <Pencil size={16} />
                Cambiar el nombre
            </MenuItem>

            <Dialog
                open={open}
                onClose={handleClose}
                fullWidth
                maxWidth="sm"
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                    }
                }}
            >
                <DialogTitle 
                    sx={{ 
                        display: "flex", 
                        alignItems: "center", 
                        gap: 1.5,
                        pb: 2,
                        pt: 3,
                        background: 'linear-gradient(135deg, rgba(230, 57, 70, 0.05) 0%, rgba(193, 18, 31, 0.05) 100%)',
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 40,
                            height: 40,
                            borderRadius: 2,
                            bgcolor: 'primary.main',
                            color: 'white',
                            boxShadow: '0 4px 12px rgba(230, 57, 70, 0.3)',
                        }}
                    >
                        <Pen size={20} />
                    </Box>
                    <Typography variant="h6" fontWeight={600}>
                        Cambiar nombre del chat
                    </Typography>

                    <IconButton
                        onClick={handleClose}
                        sx={{
                            marginLeft: "auto",
                            transition: 'all 0.2s',
                            '&:hover': {
                                bgcolor: 'error.light',
                                color: 'white',
                                transform: 'rotate(90deg)',
                            }
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent sx={{ pt: 3, pb: 3, px: 3 }}>
                    <Box
                        sx={{
                            bgcolor: 'background.paper',
                            p: 2.5,
                            borderRadius: 2,
                            border: '1px solid',
                            borderColor: 'divider',
                        }}
                    >
                        <Typography 
                            variant="body2" 
                            fontWeight={600} 
                            color="text.secondary"
                            sx={{ mb: 1.5 }}
                        >
                            Nombre del chat
                        </Typography>
                        <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="Ej: Análisis de vulnerabilidades Azure"
                            value={newChatName}
                            onChange={(e) => setNewChatName(e.target.value)}
                            onKeyDown={handleChangeNameChat}
                            autoFocus
                            sx={{
                                mb: 2,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    bgcolor: 'white',
                                    transition: 'all 0.2s',
                                    '& fieldset': {
                                        borderColor: 'divider',
                                        borderWidth: 2,
                                    },
                                    '&:hover fieldset': {
                                        borderColor: 'primary.light',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: 'primary.main',
                                        boxShadow: '0 0 0 3px rgba(230, 57, 70, 0.1)',
                                    },
                                },
                            }}
                        />

                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                bgcolor: 'rgba(230, 57, 70, 0.05)',
                                p: 1.5,
                                borderRadius: 1.5,
                                border: '1px solid',
                                borderColor: 'rgba(230, 57, 70, 0.2)',
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    minWidth: 24,
                                    height: 24,
                                    borderRadius: 1,
                                    bgcolor: 'primary.main',
                                    color: 'white',
                                    fontSize: 11,
                                    fontWeight: 700,
                                }}
                            >
                                ⏎
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                                Presiona <strong>Enter</strong> para guardar los cambios
                            </Typography>
                        </Box>
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    );
};