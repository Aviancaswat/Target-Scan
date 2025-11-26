import { Box, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const HomePage = () => {
    return (
        <Box
            width={"100%"}
            height={"100%"}
            display="flex"
            flexDirection={"column"}
            justifyContent="center"
            alignItems="center"
        >
            <Typography variant="h4">Home Page</Typography>
            <Button
                component={Link}
                to="/chat"
                variant="contained"
                sx={{ ml: 2 }}
            >
                Ir a Chat
            </Button>
        </Box>
    )
}

export default HomePage;