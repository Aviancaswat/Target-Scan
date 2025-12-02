import { IconButton, Stack, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { MessageCircleCode, MessageCircleMore, MessageCircleOff, PanelRight, Search, SquarePen, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { ConversationService } from '../../firebase/firestore/services/conversation.service';
import { useTargetScanStore } from '../../store/target-store';

export default function SideBarChat() {

    const {
        conversations,
        setCurrentConversationId,
        setCurrentMessages,
    } = useTargetScanStore();

    const btnRef = useRef<HTMLButtonElement>(null);
    const [hoverChatId, setHoverChatId] = useState<string | undefined>(undefined);
    const [open, setOpen] = useState<boolean>(false);
    const [messages,] = useState<Array<string>>([]);

    useEffect(() => {
        console.log("cambió conversationsAPA: ", conversations);
    }, [conversations])

    const handleDeleteChat = async (conversationId: string) => {

        if (!conversationId) return;

        try {

            await ConversationService.deleteConversation(conversationId);
            // AviancaToast.success("Chat eliminado", {
            //     description: "El chat se ha eliminado correctamente",
            // });
            console.log("Toast eliminado...");

        } catch (error) {
            console.error("Error eliminando chat:", error);
            //AviancaToast.error("Error al eliminar el chat");
            console.log("error eliminado en toast...");
        }
    };

    const createNewChat = async () => {
        const newId = uuid();
        setCurrentConversationId(newId);
        setCurrentMessages([]);
        console.log("Nuevo chat creado:", newId);
        setOpen(false);
    };

    const setChatSelectedUser = (conversationId: string) => {
        if (conversationId.trim().length === 0) return;
        const conversationFind = conversations.find(e => e.converdationId === conversationId);
        if (!conversationFind) return;
        setCurrentConversationId(conversationFind.converdationId);
        setCurrentMessages(conversationFind.messages);
        setOpen(false);
    }

    const toggleDrawer = (newOpen: boolean) => () => {
        setOpen(newOpen);
    };

    const DrawerList = (
        <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1, justifyContent: 'space-between' }}>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Box>
                        <MessageCircleCode size={25} />
                    </Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                        Target Scan
                    </Typography>
                </Stack>
                <IconButton onClick={toggleDrawer(false)}>
                    <X color='black' size={20} />
                </IconButton>
            </Box>
            <Divider />
            <List>
                <ListItem disablePadding>
                    <ListItemButton>
                        <ListItemIcon>
                            <SquarePen size={20} />
                        </ListItemIcon>
                        <ListItemText primary={"Nuevo chat"} />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton>
                        <ListItemIcon>
                            <Search size={20} />
                        </ListItemIcon>
                        <ListItemText primary={"Buscar chat"} />
                    </ListItemButton>
                </ListItem>
            </List>
            <Divider />
            <Box mt={1}>
                <Typography variant="subtitle1" align="left" marginLeft={2} fontWeight="bold">
                    Chats
                </Typography>
            </Box>
            <List>
                {
                    messages.length === 0 ? (
                        <Box mt={2} textAlign="center">
                            <MessageCircleOff size={30} />
                            <Typography variant="body2" color="textSecondary">
                                No hay chats disponibles
                            </Typography>
                        </Box>
                    ) : (
                        messages.map((text, index) => (
                            <ListItem key={index} disablePadding disableGutters>
                                <ListItemButton>
                                    <ListItemIcon>
                                        <MessageCircleMore size={20} />
                                    </ListItemIcon>
                                    <ListItemText primary={text} />
                                </ListItemButton>
                            </ListItem>
                        ))
                    )
                }
            </List>
        </Box>
    );

    return (
        <div>
            <IconButton onClick={toggleDrawer(true)} size='medium' sx={{ color: "text.primary" }} >
                <PanelRight />
            </IconButton>
            <Drawer open={open} onClose={toggleDrawer(false)}>
                {DrawerList}
                <Box>
                    <Button
                        variant="contained"
                        fullWidth
                        sx={{
                            borderRadius: 0,
                            position: 'absolute',
                            bottom: 0,
                            backgroundColor: '#1B1B1B',
                        }}
                    >
                        Target Scan
                    </Button>
                </Box>
            </Drawer>
        </div>
    );
}