import { keyframes, useTheme } from '@mui/material';

const shimmer = keyframes`
  0% {
    background-position: 200% center;
  }
  100% {
    background-position: -200% center;
  }
`;

export const ThinkingLoader = () => {
    const theme = useTheme();
    
    const gradient = theme.palette.mode === 'dark'
        ? 'linear-gradient(90deg, #B0B0B0 0%, #FF6B77 45%, #FFFFFF 50%, #FF6B77 55%, #B0B0B0 100%)'
        : 'linear-gradient(90deg, #E63946 0%, #FF6B77 35%, #FFD7DA 50%, #FF6B77 65%, #E63946 100%)';
    
    const shadow = theme.palette.mode === 'dark'
        ? 'drop-shadow(0 0 6px rgba(255, 107, 119, 0.4))'
        : 'drop-shadow(0 0 4px rgba(230, 57, 70, 0.3))';

    return (
        <span
            style={{
                fontSize: '1rem',
                fontWeight: 500,
                background: gradient,
                backgroundSize: '200% 100%',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                animation: `${shimmer} 2.5s ease-in-out infinite`,
                filter: shadow,
                display: 'inline-block',
                listStyle: 'none',
            }}
        >
            Pensando...
        </span>
    );
};
