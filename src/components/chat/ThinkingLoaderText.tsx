import { useTargetScanStore } from "@/store/target-store";
import { alpha, Box, keyframes, useTheme } from "@mui/material";

const shimmer = keyframes`
  0% {
    background-position: -200% center;
  }
  100% {
    background-position: 200% center;
  }
`;

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-3px);
  }
`;

export const ThinkingLoaderText = () => {
    const theme = useTheme();
    const { themeMode } = useTargetScanStore();
    const isDark = themeMode === 'dark';

    return (
        <Box
            sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                px: 2,
                py: 1,
                borderRadius: 3,
                bgcolor: isDark
                    ? alpha('#1a1a1a', 0.6)
                    : alpha('#f5f5f5', 0.8),
                border: `1px solid ${isDark ? alpha('#FFFFFF', 0.08) : alpha('#000000', 0.08)}`,
                backdropFilter: 'blur(10px)',
                boxShadow: isDark
                    ? `0 4px 12px ${alpha('#000000', 0.3)}`
                    : '0 2px 8px rgba(0, 0, 0, 0.08)',
                animation: `${float} 3s ease-in-out infinite`,
            }}
        >
            <Box
                component="span"
                sx={{
                    display: 'inline-block',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    letterSpacing: '0.5px',
                    background: isDark
                        ? 'linear-gradient(90deg, rgba(255,255,255,0.4) 0%, rgba(230,57,70,1) 20%, rgba(255,100,100,1) 40%, rgba(230,57,70,1) 60%, rgba(193,18,31,1) 80%, rgba(255,255,255,0.4) 100%)'
                        : 'linear-gradient(90deg, rgba(0,0,0,0.4) 0%, rgba(230,57,70,1) 20%, rgba(255,100,100,1) 40%, rgba(230,57,70,1) 60%, rgba(193,18,31,1) 80%, rgba(0,0,0,0.4) 100%)',
                    backgroundSize: '200% auto',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    animation: `${shimmer} 2.5s linear infinite`,
                    listStyle: 'none',
                }}
            >
                Pensando
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    gap: 0.5,
                    alignItems: 'center',
                }}
            >
                {[0, 1, 2].map((i) => (
                    <Box
                        key={i}
                        sx={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            bgcolor: theme.palette.primary.main,
                            animation: `${pulse} 1.5s ease-in-out infinite`,
                            animationDelay: `${i * 0.2}s`,
                            boxShadow: isDark
                                ? `0 0 8px ${alpha(theme.palette.primary.main, 0.6)}`
                                : `0 0 4px ${alpha(theme.palette.primary.main, 0.4)}`,
                        }}
                    />
                ))}
            </Box>
        </Box>
    );
};