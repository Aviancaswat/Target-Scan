import { ConversationService } from '@/firebase/firestore/services/conversation.service';
import { MenuItem } from '@mui/material';
import Button from '@mui/material/Button';
import { red } from '@mui/material/colors';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Trash, Trash2 } from 'lucide-react';
import * as React from 'react';
import { toast } from 'sonner';

export default function ModalDeleteChat({ conversationId }: { conversationId: string }) {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleDeleteChat = async (conversationId: string) => {
        try {
            await ConversationService.deleteConversation(conversationId);
            toast.success("Chat eliminado", {
                description: "El chat se ha eliminado correctamente",
                position: "top-right"
            });
        } catch (error) {
            console.error("Error al eliminar el chat...")
            toast.error("Error al eliminar el chat", {
                position: "top-right"
            });
        }
    };

    return (
        <React.Fragment>
            <MenuItem
                onClick={handleClickOpen}
                sx={{
                    color: "red",
                    fontSize: 14,
                    '&:hover': {
                        background: red[100]
                    }
                }}
            >
                <Trash2 size={16} style={{ marginRight: 8 }} />
                Eliminar
            </MenuItem>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title" display={"flex"} gap={1} alignItems={"center"}>
                    <Trash />{"Eliminación de chat"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        ¿Estás seguro de que deseas eliminar este chat? Esta acción no se puede deshacer.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant='outlined' color='inherit' onClick={handleClose}>Cancelar</Button>
                    <Button variant='contained' color="error" onClick={() => handleDeleteChat(conversationId)} autoFocus>
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
