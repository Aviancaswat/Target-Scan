import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemSecondaryAction,
    ListItemText,
    Menu,
    MenuItem,
    Tooltip,
    Typography
} from "@mui/material";
import {
    MessageCircleCode,
    MessageCircleMore,
    MessageCircleOff,
    PanelRightOpen,
    SquarePen,
    Trash2
} from "lucide-react";

import { useEffect, useRef, useState } from "react";
import { v4 as uuid } from "uuid";
import { ConversationService } from "../../firebase/firestore/services/conversation.service";
import { useTargetScanStore } from "../../store/target-store";
// import { ModalSearchChats } from "./ModalSearchChats";
// import { ModalUpdateChatName } from "./ModalUpdateChatName";

export default function SidebarChatHistory() {

    const {
        conversations,
        setCurrentConversationId,
        setCurrentMessages,
    } = useTargetScanStore();

    const [open, setOpen] = useState(false);
    const [hoverChatId, setHoverChatId] = useState<string | undefined>(undefined);

    const anchorRef = useRef(null);

    useEffect(() => {
        console.log("Conversaciones cargadas:", conversations);
    }, [conversations]);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleDeleteChat = async (conversationId: string) => {
        try {
            await ConversationService.deleteConversation(conversationId);
            // AviancaToast.success("Chat eliminado", {
            //     description: "El chat se ha eliminado correctamente",
            // });
            console.log("Chat eliminado...")
        } catch (error) {
            //AviancaToast.error("Error al eliminar el chat");
            console.log("Error al eliminar el chat...")
        }
    };

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
                    sx={{ color: "white" }}
                >
                    <PanelRightOpen />
                </IconButton>
            </Tooltip>

            <Drawer
                anchor="right"
                open={open}
                onClose={handleClose}
            >
                <Box sx={{ width: 320, p: 2 }}>

                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <MessageCircleCode size={30} />
                        <Typography variant="h6">Target Scan</Typography>
                    </Box>

                    <Box mt={1}>
                        <List>
                            <ListItem disablePadding>
                                <ListItemButton onClick={createNewChat}>
                                    <ListItemIcon>
                                        <SquarePen size={16} />
                                    </ListItemIcon>
                                    <ListItemText primary="Nuevo chat" />
                                </ListItemButton>
                            </ListItem>

                            {/* <ModalSearchChats onCloseSidebar={handleClose} /> */}
                        </List>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    {/* Acordeón Lista de Chats */}
                    <Accordion defaultExpanded elevation={0}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography>Chats</Typography>
                        </AccordionSummary>

                        <AccordionDetails sx={{ p: 0 }}>
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
                                            >
                                                <ListItemButton onClick={() => selectChat(e.converdationId)}>
                                                    <ListItemIcon>
                                                        <MessageCircleMore size={16} />
                                                    </ListItemIcon>

                                                    <ListItemText
                                                        primaryTypographyProps={{
                                                            noWrap: true,
                                                            fontSize: 13
                                                        }}
                                                        primary={e.title?.slice(0, 35) + (e.title?.length! > 35 ? "..." : "")}
                                                    />
                                                </ListItemButton>

                                                {/* Botón de opciones al hover */}
                                                {hoverChatId === e.converdationId && (
                                                    <ListItemSecondaryAction>
                                                        <MenuOptionsChat
                                                            conversationId={e.converdationId}
                                                            handleDeleteChat={handleDeleteChat}
                                                        />
                                                    </ListItemSecondaryAction>
                                                )}
                                            </ListItem>
                                        ))}
                                </List>
                            )}
                        </AccordionDetails>
                    </Accordion>
                </Box>
            </Drawer>
        </>
    );
};

const MenuOptionsChat = ({
    conversationId,
    handleDeleteChat,
}: {
    conversationId: string;
    handleDeleteChat: (id: string) => void;
}) => {

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleOpen = (e: React.MouseEvent<HTMLButtonElement>) =>
        setAnchorEl(e.currentTarget);

    const handleClose = () => setAnchorEl(null);

    return (
        <>
            <IconButton onClick={handleOpen} size="small">
                <MoreVertIcon fontSize="small" />
            </IconButton>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                {/* <ModalUpdateChatName conversationId={conversationId} /> */}

                <MenuItem
                    onClick={() => handleDeleteChat(conversationId)}
                    sx={{ color: "red" }}
                >
                    <Trash2 size={16} style={{ marginRight: 8 }} />
                    Eliminar
                </MenuItem>
            </Menu>
        </>
    );
};
