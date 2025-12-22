import { ConversationService } from '@/firebase/firestore/services/conversation.service';
import CloseIcon from '@mui/icons-material/Close';
import { Box, MenuItem } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import { AlertTriangle, Trash2 } from 'lucide-react';
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
                    color: "error.main",
                    fontSize: 14,
                    display: "flex",
                    gap: 1.5,
                    py: 1.5,
                    px: 2,
                    transition: 'all 0.2s',
                    borderRadius: 1,
                    '&:hover': {
                        background: 'rgba(211, 47, 47, 0.1)',
                        color: 'error.dark',
                        transform: 'translateX(4px)',
                    }
                }}
            >
                <Trash2 size={16} />
                Eliminar
            </MenuItem>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                    }
                }}
            >
                <DialogTitle 
                    id="alert-dialog-title" 
                    sx={{
                        display: "flex", 
                        alignItems: "center", 
                        gap: 1.5,
                        pb: 2,
                        pt: 3,
                        background: 'linear-gradient(135deg, rgba(211, 47, 47, 0.05) 0%, rgba(198, 40, 40, 0.05) 100%)',
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
                            bgcolor: 'error.main',
                            color: 'white',
                            boxShadow: '0 4px 12px rgba(211, 47, 47, 0.3)',
                        }}
                    >
                        <AlertTriangle size={20} />
                    </Box>
                    <Box sx={{ flexGrow: 1 }}>
                        Confirmar eliminación
                    </Box>
                    <IconButton
                        onClick={handleClose}
                        sx={{
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
                <DialogContent sx={{ pt: 3, pb: 2, px: 3 }}>
                    <Box
                        sx={{
                            bgcolor: 'rgba(211, 47, 47, 0.05)',
                            p: 2.5,
                            borderRadius: 2,
                            border: '2px solid',
                            borderColor: 'rgba(211, 47, 47, 0.2)',
                        }}
                    >
                        <DialogContentText 
                            id="alert-dialog-description"
                            sx={{
                                fontSize: 15,
                                color: 'text.primary',
                                lineHeight: 1.6,
                            }}
                        >
                            ¿Estás seguro de que deseas eliminar este chat? <br /> 
                            <Box component="span" sx={{ fontWeight: 600, color: 'error.main' }}>
                                Esta acción no se puede deshacer
                            </Box>
                            {' '}y perderás todo el historial de conversación.
                        </DialogContentText>
                    </Box>
                </DialogContent>
                <DialogActions 
                    sx={{ 
                        p: 3,
                        gap: 1.5,
                        background: 'linear-gradient(135deg, rgba(211, 47, 47, 0.05) 0%, rgba(198, 40, 40, 0.05) 100%)',
                        borderTop: '1px solid',
                        borderColor: 'divider',
                    }}
                >
                    <Button 
                        variant='outlined' 
                        color='inherit' 
                        onClick={handleClose}
                        sx={{
                            borderRadius: 2,
                            px: 3,
                            py: 1,
                            fontWeight: 600,
                            borderWidth: 2,
                            transition: 'all 0.2s',
                            '&:hover': {
                                borderWidth: 2,
                                transform: 'translateY(-2px)',
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                            }
                        }}
                    >
                        Cancelar
                    </Button>
                    <Button 
                        variant='contained' 
                        color="error" 
                        onClick={() => handleDeleteChat(conversationId)} 
                        autoFocus
                        startIcon={<Trash2 size={18} />}
                        sx={{
                            borderRadius: 2,
                            px: 3,
                            py: 1,
                            fontWeight: 600,
                            boxShadow: '0 4px 12px rgba(211, 47, 47, 0.3)',
                            transition: 'all 0.2s',
                            '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 6px 16px rgba(211, 47, 47, 0.4)',
                            }
                        }}
                    >
                        Eliminar chat
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
