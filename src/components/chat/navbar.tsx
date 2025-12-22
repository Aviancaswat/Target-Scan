import { useTargetScanStore } from '@/store/target-store';
import { alpha, Stack, useTheme } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { MessageCircleCode } from 'lucide-react';
import { Link } from 'react-router-dom';
import SideBarChat from './sidebar-chat';
import { ThemeToggle } from './ThemeToggle';

const Navbar = () => {
    const theme = useTheme();
    const { themeMode } = useTargetScanStore();
    const isDark = themeMode === 'dark';

    return (
        <AppBar position="fixed" color="primary" elevation={0} 
            sx={{
                backdropFilter: 'blur(24px)',
                bgcolor: isDark
                    ? alpha('#0a0a0a', 0.85)
                    : theme.palette.primary.main,
                borderBottom: isDark
                    ? `1px solid ${alpha('#FFFFFF', 0.08)}`
                    : 'none',
                boxShadow: isDark
                    ? `0 4px 20px ${alpha('#000000', 0.4)}`
                    : '0 2px 8px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease',
            }}
        >
            <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Stack
                    component={Link}
                    to={"/"}
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    mr={2}
                    sx={{
                        textTransform: "none",
                        textDecoration: "none",
                        color: isDark
                            ? '#FFFFFF'
                            : theme.palette.secondary.main,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            color: isDark
                                ? theme.palette.primary.main
                                : theme.palette.secondary.main,
                            transform: 'scale(1.02)',
                        }
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
                <Stack direction="row" spacing={1} alignItems="center">
                    <ThemeToggle />
                    <SideBarChat />
                </Stack>
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;
