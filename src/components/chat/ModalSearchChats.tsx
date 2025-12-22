import { useTargetScanStore, type ConversationsTargetScan } from "@/store/target-store";
import CloseIcon from "@mui/icons-material/Close";
import {
    alpha,
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
    Typography,
    useTheme
} from "@mui/material";
import { debounce } from "lodash";
import { MessageCircleMore, Search } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export const ModalSearchChats = ({ onCloseSidebar }: { onCloseSidebar: Function }) => {
    const theme = useTheme();
    const { conversations: data, setCurrentConversationId, setCurrentMessages, themeMode } = useTargetScanStore();
    const isDark = themeMode === 'dark';
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
                <ListItemButton 
                    onClick={handleOpen}
                    sx={{
                        py: 1.5,
                        transition: 'all 0.2s',
                        color: 'text.primary',
                        '&:hover': {
                            bgcolor: isDark
                                ? alpha(theme.palette.primary.main, 0.2)
                                : 'primary.light',
                            color: isDark
                                ? '#FFFFFF'
                                : 'primary.contrastText',
                            transform: 'translateX(4px)',
                            '& .MuiListItemIcon-root': {
                                color: isDark
                                    ? '#FFFFFF'
                                    : 'primary.contrastText',
                            }
                        }
                    }}
                >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                        <Search size={18} />
                    </ListItemIcon>
                    <ListItemText primary="Buscar Chat" primaryTypographyProps={{ fontWeight: 500 }} />
                </ListItemButton>
            </ListItem>

            <Dialog 
                open={open} 
                onClose={handleClose} 
                fullWidth 
                maxWidth="sm"
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        boxShadow: isDark
                            ? `0 12px 48px ${alpha('#000000', 0.8)}`
                            : '0 8px 32px rgba(0, 0, 0, 0.12)',
                        bgcolor: isDark
                            ? alpha('#1a1a1a', 0.95)
                            : 'background.paper',
                        border: isDark
                            ? `1px solid ${alpha('#FFFFFF', 0.1)}`
                            : 'none',
                    }
                }}
            >
                <DialogTitle 
                    sx={{ 
                        pb: 2,
                        pt: 3,
                        background: isDark
                            ? `linear-gradient(135deg, ${alpha('#E63946', 0.15)} 0%, ${alpha('#C1121F', 0.15)} 100%)`
                            : 'linear-gradient(135deg, rgba(230, 57, 70, 0.05) 0%, rgba(193, 18, 31, 0.05) 100%)',
                        borderBottom: '1px solid',
                        borderColor: isDark
                            ? alpha('#FFFFFF', 0.08)
                            : 'divider',
                    }}
                >
                    <Box display="flex" alignItems="center" gap={1.5}>
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
                            <Search size={20} />
                        </Box>
                        <Typography variant="h6" fontWeight={600}>Buscar chat</Typography>

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
                            mt: 3,
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                bgcolor: isDark
                                    ? alpha('#0a0a0a', 0.6)
                                    : 'background.paper',
                                color: 'text.primary',
                                transition: 'all 0.2s',
                                '& fieldset': {
                                    borderColor: isDark
                                        ? alpha('#FFFFFF', 0.15)
                                        : 'divider',
                                    borderWidth: 2,
                                },
                                '&:hover fieldset': {
                                    borderColor: isDark
                                        ? alpha('#FFFFFF', 0.25)
                                        : 'primary.light',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: 'primary.main',
                                    boxShadow: isDark
                                        ? `0 0 0 3px ${alpha(theme.palette.primary.main, 0.25)}`
                                        : '0 0 0 3px rgba(230, 57, 70, 0.1)',
                                },
                            },
                            '& .MuiInputBase-input::placeholder': {
                                color: isDark
                                    ? alpha('#FFFFFF', 0.4)
                                    : undefined,
                                opacity: 1,
                            },
                        }}
                    />

                    <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        mt={3}
                        px={0.5}
                    >
                        <Typography
                            variant="subtitle2"
                            fontWeight={600}
                            color="text.secondary"
                        >
                            Resultados
                        </Typography>
                        <Box
                            sx={{
                                bgcolor: 'primary.main',
                                color: 'white',
                                px: 1.5,
                                py: 0.5,
                                borderRadius: 2,
                                fontSize: 12,
                                fontWeight: 600,
                            }}
                        >
                            {dataFilter.length}
                        </Box>
                    </Box>
                </DialogTitle>

                <DialogContent 
                    dividers 
                    sx={{ 
                        maxHeight: 320, 
                        p: 1,
                        bgcolor: isDark
                            ? alpha('#0a0a0a', 0.4)
                            : 'background.default',
                        borderColor: isDark
                            ? alpha('#FFFFFF', 0.08)
                            : undefined,
                        '&::-webkit-scrollbar': {
                            width: '8px',
                        },
                        '&::-webkit-scrollbar-track': {
                            background: 'transparent',
                        },
                        '&::-webkit-scrollbar-thumb': {
                            background: isDark
                                ? alpha('#FFFFFF', 0.2)
                                : 'rgba(0,0,0,0.2)',
                            borderRadius: '4px',
                            '&:hover': {
                                background: isDark
                                    ? alpha('#FFFFFF', 0.35)
                                    : 'rgba(0,0,0,0.3)',
                            },
                        },
                    }}
                >
                    {/* RESULTADOS */}
                    {dataFilter.length > 0 ? (
                        <List dense sx={{ p: 0 }}>
                            {dataFilter.map(item => (
                                <ListItemButton
                                    key={item.converdationId}
                                    onClick={() => setChatSelected(item.converdationId)}
                                    sx={{
                                        borderRadius: 2,
                                        mb: 0.5,
                                        py: 1.5,
                                        transition: 'all 0.2s',
                                        bgcolor: isDark
                                            ? alpha('#1a1a1a', 0.6)
                                            : 'background.paper',
                                        border: '1px solid',
                                        borderColor: isDark
                                            ? alpha('#FFFFFF', 0.08)
                                            : 'divider',
                                        '&:hover': { 
                                            bgcolor: isDark
                                                ? alpha(theme.palette.primary.main, 0.2)
                                                : 'rgba(230, 57, 70, 0.08)',
                                            borderColor: isDark
                                                ? alpha(theme.palette.primary.main, 0.5)
                                                : 'primary.light',
                                            transform: 'translateX(4px)',
                                            boxShadow: isDark
                                                ? `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`
                                                : '0 2px 8px rgba(230, 57, 70, 0.15)',
                                        }
                                    }}
                                >
                                    <ListItemIcon sx={{ minWidth: 40 }}>
                                        <MessageCircleMore size={20} />
                                    </ListItemIcon>

                                    <ListItemText
                                        primary={
                                            <Typography fontSize="0.9rem" fontWeight={500}>
                                                {item.title}
                                            </Typography>
                                        }
                                    />
                                </ListItemButton>
                            ))}
                        </List>
                    ) : (
                        <Box
                            minHeight={200}
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            flexDirection="column"
                            gap={2}
                            sx={{
                                bgcolor: 'background.paper',
                                borderRadius: 2,
                                border: '2px dashed',
                                borderColor: 'divider',
                            }}
                        >
                            <Search size={48} color="#bdbdbd" />
                            <Typography color="text.secondary" fontWeight={500}>
                                No se encontraron resultados
                            </Typography>
                        </Box>
                    )}
                </DialogContent>

                <DialogActions 
                    sx={{ 
                        alignSelf: "end",
                        p: 2.5,
                        background: 'linear-gradient(135deg, rgba(230, 57, 70, 0.05) 0%, rgba(193, 18, 31, 0.05) 100%)',
                        borderTop: '1px solid',
                        borderColor: 'divider',
                    }}
                >
                    <Typography 
                        variant="subtitle1" 
                        fontWeight={700} 
                        sx={{ 
                            mr: "auto",
                            background: 'linear-gradient(135deg, #E63946 0%, #C1121F 100%)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                    >
                        Target Scan
                    </Typography>
                </DialogActions>
            </Dialog>
        </>
    );
};
