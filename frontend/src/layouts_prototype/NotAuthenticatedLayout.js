import { Box, Toolbar } from "@mui/material";
import { Outlet } from "react-router-dom";
import PublicNavbar from "../components/navbar/PublicNavbar";

function NotAuthenticatedLayout() {
    return (
        <>
            <PublicNavbar />
            <Box component="main" height="100vh" p={3} >
                <Toolbar />
                <Outlet />
            </Box>
        </>
    );
}

export default NotAuthenticatedLayout;