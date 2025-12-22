import { useTargetScanStore } from "@/store/target-store";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    alpha,
    Box,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Menu,
    Tooltip,
    Typography,
    useTheme
} from "@mui/material";
import {
    MessageCircleCode,
    MessageCircleMore,
    MessageCircleOff,
    PanelRightOpen,
    SquarePen
} from "lucide-react";
import { useRef, useState } from "react";
import { v4 as uuid } from "uuid";
import ModalDeleteChat from "./ModalDeleteChat";
import { ModalSearchChats } from "./ModalSearchChats";
import { ModalUpdateChatName } from "./ModalUpdateChatName";

export default function SidebarChatHistory() {
    const theme = useTheme();
    const {
        conversations,
        setCurrentConversationId,
        setCurrentMessages,
        currentConversationId,
        themeMode
    } = useTargetScanStore();

    const isDark = themeMode === 'dark';
    const [open, setOpen] = useState(false);
    const [hoverChatId, setHoverChatId] = useState<string | undefined>(undefined);
    const anchorRef = useRef(null);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const createNewChat = async () => {
        const id = uuid();
        setCurrentConversationId(id);
        setCurrentMessages([]);
        handleClose();
    };

    const selectChat = (conversationId: string) => {
        const conv = conversations.find(e => e.converdationId === conversationId);
        if (!conv) return;
        setCurrentConversationId(conv.converdationId);
        setCurrentMessages(conv.messages);
        handleClose();
    };

    return (
        <>
            <Tooltip title="Historial de chats" placement="left">
                <IconButton
                    ref={anchorRef}
                    size="small"
                    onClick={handleOpen}
                    sx={{ color: "secondary.main" }}
                >
                    <PanelRightOpen />
                </IconButton>
            </Tooltip>

            <Drawer
                anchor="right"
                open={open}
                onClose={handleClose}
                PaperProps={{
                    sx: {
                        background: isDark
                            ? 'linear-gradient(to bottom, #0a0a0a, #1a1a1a)'
                            : 'linear-gradient(to bottom, #ffffff, #fafafa)',
                        boxShadow: isDark
                            ? `-6px 0 32px ${alpha('#000000', 0.6)}`
                            : '-4px 0 24px rgba(0, 0, 0, 0.12)',
                        borderLeft: isDark
                            ? `1px solid ${alpha('#FFFFFF', 0.08)}`
                            : 'none',
                    }
                }}
            >
                <Box sx={{ 
                    width: 320, 
                    p: 2.5, 
                    height: '100vh', 
                    display: 'flex', 
                    flexDirection: 'column',
                    overflow: 'hidden'
                }}>

                    <Box
                        display="flex"
                        alignItems="center"
                        gap={1.5}
                        mb={2}
                        p={1.5}
                        borderRadius={2.5}
                        sx={{
                            background: isDark
                                ? `linear-gradient(135deg, ${alpha('#E63946', 0.9)} 0%, ${alpha('#C1121F', 0.9)} 100%)`
                                : 'linear-gradient(135deg, #E63946 0%, #C1121F 100%)',
                            color: 'white',
                            boxShadow: isDark
                                ? `0 6px 20px ${alpha('#E63946', 0.4)}`
                                : '0 4px 12px rgba(230, 57, 70, 0.3)',
                            border: isDark
                                ? `1px solid ${alpha('#FFFFFF', 0.1)}`
                                : 'none',
                        }}
                    >
                        <MessageCircleCode size={25} />
                        <Typography variant="h6" fontWeight={600}>Target Scan</Typography>
                    </Box>

                    <Divider sx={{ my: 2, opacity: 0.6 }} />

                    <Box
                        borderRadius={2}
                        sx={{
                            bgcolor: isDark
                                ? alpha('#1a1a1a', 0.6)
                                : 'background.paper',
                            border: '1px solid',
                            borderColor: isDark
                                ? alpha('#FFFFFF', 0.08)
                                : 'divider',
                            boxShadow: isDark
                                ? `0 4px 16px ${alpha('#000000', 0.4)}`
                                : '0 2px 8px rgba(0, 0, 0, 0.05)',
                            overflow: 'hidden',
                        }}
                    >
                        <List disablePadding>
                            <ListItem disablePadding>
                                <ListItemButton 
                                    onClick={createNewChat}
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
                                        <SquarePen size={18} />
                                    </ListItemIcon>
                                    <ListItemText primary="Nuevo chat" primaryTypographyProps={{ fontWeight: 500 }} />
                                </ListItemButton>
                            </ListItem>

                            <ModalSearchChats onCloseSidebar={handleClose} />
                        </List>
                    </Box>

                    <Divider sx={{ 
                        my: 2, 
                        opacity: isDark ? 0.15 : 0.6,
                        borderColor: isDark
                            ? alpha('#FFFFFF', 0.1)
                            : undefined,
                    }} />

                    <Box sx={{ flexGrow: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                        <Accordion 
                            defaultExpanded 
                            elevation={0} 
                            sx={{ 
                                overflow: 'visible',
                                bgcolor: isDark
                                    ? alpha('#1a1a1a', 0.6)
                                    : 'background.paper',
                                border: '1px solid',
                                borderColor: isDark
                                    ? alpha('#FFFFFF', 0.08)
                                    : 'divider',
                                borderRadius: 2,
                                boxShadow: isDark
                                    ? `0 4px 16px ${alpha('#000000', 0.4)}`
                                    : '0 2px 8px rgba(0, 0, 0, 0.05)',
                                '&:before': { display: 'none' },
                            }}
                        >
                            <AccordionSummary 
                                expandIcon={<ExpandMoreIcon sx={{ color: 'text.primary' }} />}
                                sx={{
                                    borderBottom: '1px solid',
                                    borderColor: isDark
                                        ? alpha('#FFFFFF', 0.08)
                                        : 'divider',
                                    minHeight: 48,
                                    '&.Mui-expanded': {
                                        minHeight: 48,
                                    },
                                }}
                            >
                                <Typography fontWeight={600} fontSize={14} color="text.primary">Chats</Typography>
                            </AccordionSummary>

                            <AccordionDetails sx={{ 
                                p: 0, 
                                maxHeight: 'calc(100vh - 350px)',
                                overflow: 'auto',
                                '&::-webkit-scrollbar': {
                                    width: '6px',
                                },
                                '&::-webkit-scrollbar-track': {
                                    background: 'transparent',
                                },
                                '&::-webkit-scrollbar-thumb': {
                                    background: isDark
                                        ? alpha('#FFFFFF', 0.15)
                                        : 'rgba(0,0,0,0.2)',
                                    borderRadius: '3px',
                                    '&:hover': {
                                        background: isDark
                                            ? alpha('#FFFFFF', 0.25)
                                            : 'rgba(0,0,0,0.3)',
                                    },
                                },
                            }}>
                            {conversations.length === 0 ? (
                                <Box
                                    display="flex"
                                    flexDirection="column"
                                    alignItems="center"
                                    textAlign="center"
                                    gap={1}
                                    py={2}
                                >
                                    <MessageCircleOff size={40} />
                                    <Typography variant="body2">
                                        Aún no tienes conversaciones.
                                    </Typography>
                                </Box>
                            ) : (
                                <List>
                                    {conversations
                                        .filter(e => e.messages.length > 0)
                                        .map(e => (
                                            <ListItem
                                                key={e.converdationId}
                                                disablePadding
                                                onMouseEnter={() => setHoverChatId(e.converdationId)}
                                                onMouseLeave={() => setHoverChatId(undefined)}
                                                sx={{
                                                    position: 'relative',
                                                    borderLeft: e.converdationId === currentConversationId ? 4 : 0,
                                                    borderColor: e.converdationId === currentConversationId ? 'primary.main' : 'transparent',
                                                    backgroundColor: e.converdationId === currentConversationId 
                                                        ? isDark
                                                            ? alpha(theme.palette.primary.main, 0.15)
                                                            : 'rgba(230, 57, 70, 0.08)'
                                                        : 'inherit',
                                                    mb: 0.5,
                                                    borderRadius: 1,
                                                    transition: 'all 0.2s',
                                                }}
                                            >
                                                <ListItemButton 
                                                    onClick={() => selectChat(e.converdationId)}
                                                    sx={{
                                                        py: 1.5,
                                                        px: 2,
                                                        pr: hoverChatId === e.converdationId ? 7 : 2,
                                                        borderRadius: 1,
                                                        transition: 'all 0.2s',
                                                        '&:hover': {
                                                            backgroundColor: isDark
                                                                ? alpha('#FFFFFF', 0.05)
                                                                : 'rgba(0, 0, 0, 0.04)',
                                                        }
                                                    }}
                                                >
                                                    <ListItemIcon sx={{ minWidth: 36 }}>
                                                        <MessageCircleMore size={18} />
                                                    </ListItemIcon>

                                                    <ListItemText
                                                        primaryTypographyProps={{
                                                            noWrap: true,
                                                            fontSize: 13.5,
                                                            fontWeight: e.converdationId === currentConversationId ? 600 : 400,
                                                        }}
                                                        primary={e.title?.slice(0, 35) + (e.title?.length! > 35 ? "..." : "")}
                                                    />
                                                </ListItemButton>

                                                <Box
                                                    sx={{
                                                        position: 'absolute',
                                                        right: 8,
                                                        top: '50%',
                                                        transform: 'translateY(-50%)',
                                                        opacity: hoverChatId === e.converdationId ? 1 : 0,
                                                        visibility: hoverChatId === e.converdationId ? 'visible' : 'hidden',
                                                        transition: 'opacity 0.2s, visibility 0.2s',
                                                        zIndex: 10,
                                                    }}
                                                >
                                                    <MenuOptionsChat
                                                        conversationId={e.converdationId}
                                                        onMenuOpen={() => setHoverChatId(e.converdationId)}
                                                    />
                                                </Box>
                                            </ListItem>
                                        ))}
                                </List>
                            )}
                        </AccordionDetails>
                    </Accordion>
                    </Box>
                </Box>
            </Drawer>
        </>
    );
};

const MenuOptionsChat = ({
    conversationId,
    onMenuOpen,
}: {
    conversationId: string;
    onMenuOpen?: () => void;
}) => {

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        setAnchorEl(e.currentTarget);
        onMenuOpen?.();
    };

    const handleClose = () => setAnchorEl(null);

    return (
        <>
            <IconButton 
                onClick={handleOpen} 
                size="small"
                sx={{
                    bgcolor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                    transition: 'all 0.2s',
                    '&:hover': {
                        bgcolor: 'primary.main',
                        color: 'white',
                        borderColor: 'primary.main',
                        transform: 'scale(1.1)',
                    }
                }}
            >
                <MoreVertIcon fontSize="small" />
            </IconButton>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                slotProps={{
                    paper: {
                        sx: {
                            borderRadius: 2,
                            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
                            mt: 0.5,
                        }
                    }
                }}
            >
                <ModalUpdateChatName conversationId={conversationId} />
                <ModalDeleteChat conversationId={conversationId} />
            </Menu>
        </>
    );
};
