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
import { MessageCircleCode, MessageCircleMore, PanelRight, Search, SquarePen, X } from 'lucide-react';
import { useState } from 'react';

export default function SideBarChat() {

    const [open, setOpen] = useState<boolean>(false);

    const toggleDrawer = (newOpen: boolean) => () => {
        setOpen(newOpen);
    };

    const DrawerList = (
        <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1, justifyContent: 'space-between' }}>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Box>
                        <MessageCircleCode size={30} />
                    </Box>
                    <Typography variant="h6" fontWeight="bold">
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
                <ListItem disablePadding>
                    <ListItemButton>
                        <ListItemIcon>
                            <MessageCircleMore />
                        </ListItemIcon>
                        <ListItemText primary={"Chat 1 de ejemplo"} />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton>
                        <ListItemIcon>
                            <MessageCircleMore />
                        </ListItemIcon>
                        <ListItemText primary={"Chat 1 de ejemplo"} />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton>
                        <ListItemIcon>
                            <MessageCircleMore />
                        </ListItemIcon>
                        <ListItemText primary={"Chat 1 de ejemplo"} />
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    );

    return (
        <div>
            <IconButton onClick={toggleDrawer(true)} size='medium'>
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

                        Targer Scan
                    </Button>
                </Box>
            </Drawer>
        </div>
    );
}