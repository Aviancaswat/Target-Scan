import { Box } from "@mui/material";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <Box width={"100vw"} height={"100dvh"}>
            {children}
        </Box>
    )
}