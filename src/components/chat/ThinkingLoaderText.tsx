import { useTargetScanStore } from "@/store/target-store";
import { Box, keyframes } from "@mui/material";

const shimmer = keyframes`
  0% {
    background-position: -200% center;
  }
  100% {
    background-position: 200% center;
  }
`;

export const ThinkingLoaderText = () => {
    const { themeMode } = useTargetScanStore();
    const isDark = themeMode === 'dark';

    return (
        <Box
            component="span"
            sx={{
                display: 'inline-block',
                fontSize: '1rem',
                fontWeight: 600,
                background: isDark
                    ? 'linear-gradient(90deg, rgba(255,255,255,0.3) 0%, rgba(230,57,70,1) 25%, rgba(193,18,31,1) 50%, rgba(230,57,70,1) 75%, rgba(255,255,255,0.3) 100%)'
                    : 'linear-gradient(90deg, rgba(0,0,0,0.3) 0%, rgba(230,57,70,1) 25%, rgba(193,18,31,1) 50%, rgba(230,57,70,1) 75%, rgba(0,0,0,0.3) 100%)',
                backgroundSize: '200% auto',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                animation: `${shimmer} 2s linear infinite`,
                listStyle: 'none',
            }}
        >
            Pensando...
        </Box>
    );
};
