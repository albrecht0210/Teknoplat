import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

function MainLayout() {
    console.log("Main Layout")
    return (
        <Outlet />
    );
}

export default MainLayout;