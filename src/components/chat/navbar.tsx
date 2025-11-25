import { Stack } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { MessageCircleCode } from 'lucide-react';
import SideBarChat from './sidebar-chat';

const Navbar = () => {
    return (
        <Box sx={{ flexGrow: 1, background: "#1B1B1B" }}>
            <AppBar position="fixed" color="default" elevation={0}>
                <Toolbar>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <SideBarChat />
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
                    </Stack>

                    {/* Esto es para el final del documento */}
                </Toolbar>
            </AppBar>
        </Box>
    );
}

export default Navbar;
