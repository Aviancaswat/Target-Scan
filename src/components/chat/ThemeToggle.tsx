import { useTargetScanStore } from "@/store/target-store";
import { IconButton, Tooltip } from "@mui/material";
import { Moon, Sun } from "lucide-react";

export const ThemeToggle = () => {
    const { themeMode, toggleTheme } = useTargetScanStore();
    const isDark = themeMode === 'dark';

    return (
        <Tooltip title={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"} placement="bottom">
            <IconButton
                onClick={toggleTheme}
                sx={{
                    color: 'text.primary',
                    transition: 'all 0.3s',
                    '&:hover': {
                        bgcolor: 'primary.main',
                        color: 'primary.contrastText',
                        transform: 'rotate(180deg)',
                    }
                }}
            >
                {isDark ? <Sun size={22} /> : <Moon size={22} />}
            </IconButton>
        </Tooltip>
    );
};
