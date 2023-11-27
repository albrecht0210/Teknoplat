import { Box, Button, Stack, Toolbar, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import PublicNavbar from "../../components/navbar/PublicNavbar";

function ErrorPage() {
    const { access } = useSelector((state) => state.auth);

    const navigate = useNavigate();

    const handleClick = () => {
        navigate("/");
    }

    return (
        <Box>
            <PublicNavbar />
            <Toolbar />
            <Box m={5}>
                <Typography variant="h3" sx={{ mb: 2 }}>It seems that you are lost.</Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="body1">Redirect to</Typography>
                    <Button variant="contained" onClick={handleClick}>{ !access ? "Login" : "Dashboard" }</Button>
                </Stack>
            </Box>
        </Box>
    );
}

export default ErrorPage;