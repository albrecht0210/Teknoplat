import { Box, Toolbar } from "@mui/material";
import { Outlet } from "react-router-dom";
import PublicNavbar from "../components/navbar/PublicNavbar";

function NotAuthenticatedLayout() {
    return (
        <>
            <PublicNavbar />
            <Box height="100vh" >
                <Toolbar />
                <Outlet />
            </Box>
        </>
    );
}

export default NotAuthenticatedLayout;