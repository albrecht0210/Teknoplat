import { Box } from "@mui/material";
import LoginCard from "./LoginCard";

function LoginPage() {
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "calc(100vh - 64px)"
            }}
        >
            <LoginCard />
        </Box>
    );
}

export default LoginPage;