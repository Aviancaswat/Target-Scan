import {
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    MenuItem,
    TextField,
    Typography
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import { Pen, Pencil } from "lucide-react";

import { useState } from "react";
import { toast } from "sonner";
import { ConversationService } from "../../firebase/firestore/services/conversation.service";

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
                    "&:hover": {
                        background: "#f1f1f1",
                        color: "black"
                    },
                }}
            >
                <Pencil size={15} />
                Cambiar el nombre
            </MenuItem>

            <Dialog
                open={open}
                onClose={handleClose}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Pen size={20} />
                    <Typography variant="h6" fontWeight={700}>
                        Nuevo nombre de chat
                    </Typography>

                    <IconButton
                        onClick={handleClose}
                        sx={{
                            marginLeft: "auto",
                            "&:hover": { backgroundColor: "#f1f1f1" }
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent sx={{ pt: 1 }}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="requerimiento del azure con id: 1234567"
                        value={newChatName}
                        onChange={(e) => setNewChatName(e.target.value)}
                        onKeyDown={handleChangeNameChat}
                        autoFocus
                        sx={{
                            mb: 1,
                            "& .MuiOutlinedInput-root.Mui-focused fieldset": {
                                borderColor: "#bdbdbd",
                            }
                        }}
                    />

                    <Typography variant="body2" color="gray" sx={{ mb: 2 }}>
                        Presiona Enter para actualizar el nombre
                    </Typography>
                </DialogContent>
            </Dialog>
        </>
    );
};
