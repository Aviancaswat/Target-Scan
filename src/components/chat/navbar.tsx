import { Stack } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { MessageCircleCode } from 'lucide-react';
import SideBarChat from './sidebar-chat';

const Navbar = () => {
    return (
        <AppBar position="fixed" color="default" elevation={0}>
            <Toolbar>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Box>
                        <MessageCircleCode size={30} />
                    </Box>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ flexGrow: 1 }}
                        fontWeight={"bold"}
                    >
                        Target Scan
                    </Typography>
                    <SideBarChat />
                </Stack>
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;
