import { Stack } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { MessageCircleCode } from 'lucide-react';
import { Link } from 'react-router-dom';
import SideBarChat from './sidebar-chat';

const Navbar = () => {
    return (
        <AppBar position="fixed" color="primary" elevation={0} >
            <Toolbar sx={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                <Stack
                    component={Link}
                    to={"/"}
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    color={"text.primary"}
                    mr={2}
                    sx={{
                        textTransform: "none",
                        textDecoration: "none"
                    }}
                >
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
                <SideBarChat />
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;
