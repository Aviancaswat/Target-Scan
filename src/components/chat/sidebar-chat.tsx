import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { MessageCircleCode, MessageCircleMore, PanelRight, Search, SquarePen } from 'lucide-react';
import { useState } from 'react';

export default function SideBarChat() {

    const [open, setOpen] = useState<boolean>(false);

    const toggleDrawer = (newOpen: boolean) => () => {
        setOpen(newOpen);
    };

    const DrawerList = (
        <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: "center", gap: 1, p: 1 }}>
                <Box>
                    <MessageCircleCode size={30} />
                </Box>
                <Typography variant="h6" fontWeight="bold">
                    Target Scan
                </Typography>
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
            <Box mt={5}>
                <Typography variant="h6" align="left" marginLeft={2} fontWeight="bold">
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
            <Button onClick={toggleDrawer(true)} size='medium'>
                <PanelRight />
            </Button>
            <Drawer open={open} onClose={toggleDrawer(false)}>
                {DrawerList}
            </Drawer>
        </div>
    );
}