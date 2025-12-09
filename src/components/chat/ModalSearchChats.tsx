import { useTargetScanStore, type ConversationsTargetScan } from "@/store/target-store";
import CloseIcon from "@mui/icons-material/Close";
import {
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    TextField,
    Typography
} from "@mui/material";
import { debounce } from "lodash";
import { MessageCircleMore, Search } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export const ModalSearchChats = ({ onCloseSidebar }: { onCloseSidebar: Function }) => {

    const { conversations: data, setCurrentConversationId, setCurrentMessages } = useTargetScanStore();
    const [open, setOpen] = useState(false);
    const [dataFilter, setDataFilter] = useState<ConversationsTargetScan[]>(data);
    const [valueSearchChat, setSearchChat] = useState("");

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setSearchChat("");
        setDataFilter(data);
        setOpen(false);
    };

    useEffect(() => {
        if (!valueSearchChat) setDataFilter(data);
    }, [valueSearchChat, data]);

    const handleSearch = useCallback(
        debounce((value: string) => {
            const filtered = data.filter(item =>
                item.title?.toLowerCase().includes(value.toLowerCase())
            );
            setDataFilter(filtered);
        }, 300),
        [data]
    );

    const setChatSelected = (conversationId: string) => {
        const chat = data.find(e => e.converdationId === conversationId);
        if (!chat) return;

        setCurrentConversationId(chat.converdationId);
        setCurrentMessages(chat.messages);

        handleClose();
        onCloseSidebar();
    };

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchChat(value);
        handleSearch(value);
    };

    return (
        <>
            <ListItem disablePadding>
                <ListItemButton onClick={handleOpen}>
                    <ListItemIcon>
                        <Search size={16} />
                    </ListItemIcon>
                    <ListItemText primary="Buscar Chat" />
                </ListItemButton>
            </ListItem>

            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                <DialogTitle sx={{ pb: 1 }}>
                    <Box display="flex" alignItems="center" gap={1.5}>
                        <Search size={20} />
                        <Typography variant="h6">Buscar chat</Typography>

                        <IconButton
                            onClick={handleClose}
                            sx={{ marginLeft: "auto" }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    {/* INPUT DE BÚSQUEDA */}
                    <TextField
                        fullWidth
                        autoFocus
                        variant="outlined"
                        placeholder="Busca por el nombre del chat"
                        value={valueSearchChat}
                        onChange={handleInput}
                        sx={{
                            mt: 2,
                            "& .MuiOutlinedInput-root.Mui-focused fieldset": {
                                borderColor: "#bdbdbd",
                            }
                        }}
                    />

                    <Typography
                        variant="subtitle2"
                        sx={{ mt: 3 }}
                    >
                        Tus chats ({dataFilter.length})
                    </Typography>
                </DialogTitle>

                <DialogContent dividers sx={{ maxHeight: 250, p: 0 }}>
                    {/* RESULTADOS */}
                    {dataFilter.length > 0 ? (
                        <List dense>
                            {dataFilter.map(item => (
                                <ListItemButton
                                    key={item.converdationId}
                                    onClick={() => setChatSelected(item.converdationId)}
                                    sx={{
                                        "&:hover": { backgroundColor: "#f1f1f1" }
                                    }}
                                >
                                    <ListItemIcon>
                                        <MessageCircleMore size={18} />
                                    </ListItemIcon>

                                    <ListItemText
                                        primary={
                                            <Typography fontSize="0.9rem">
                                                {item.title}
                                            </Typography>
                                        }
                                    />
                                </ListItemButton>
                            ))}
                        </List>
                    ) : (
                        <Box
                            minHeight={150}
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            flexDirection="column"
                            gap={1}
                        >
                            <Typography color="gray">Sin resultados</Typography>
                        </Box>
                    )}
                </DialogContent>

                <DialogActions sx={{ alignSelf: "end" }}>
                    <Typography variant="subtitle1" fontWeight={700} sx={{ mr: "auto", pl: 1 }}>
                        Target Scan
                    </Typography>
                </DialogActions>
            </Dialog>
        </>
    );
};
