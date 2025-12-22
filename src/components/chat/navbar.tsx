import { alpha, Stack } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { MessageCircleCode } from 'lucide-react';
import { Link } from 'react-router-dom';
import SideBarChat from './sidebar-chat';
import { ThemeToggle } from './ThemeToggle';

const Navbar = () => {
    return (
        <AppBar position="fixed" color="primary" elevation={0} 
            sx={(theme) => ({
                backdropFilter: 'blur(20px)',
                bgcolor: theme.palette.mode === 'dark'
                    ? alpha(theme.palette.background.paper, 0.85)
                    : theme.palette.primary.main,
                borderBottom: theme.palette.mode === 'dark'
                    ? `1px solid ${alpha(theme.palette.divider, 0.2)}`
                    : 'none',
                boxShadow: theme.palette.mode === 'dark'
                    ? `0 2px 12px ${alpha(theme.palette.primary.main, 0.15)}`
                    : 'none',
            })}
        >
            <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Stack
                    component={Link}
                    to={"/"}
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    mr={2}
                    sx={(theme) => ({
                        textTransform: "none",
                        textDecoration: "none",
                        color: theme.palette.mode === 'dark'
                            ? theme.palette.text.primary
                            : theme.palette.secondary.main,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            color: theme.palette.mode === 'dark'
                                ? theme.palette.primary.main
                                : theme.palette.secondary.main,
                        }
                    })}
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
                <Stack direction="row" spacing={1} alignItems="center">
                    <ThemeToggle />
                    <SideBarChat />
                </Stack>
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;
