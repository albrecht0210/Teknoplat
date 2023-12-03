import { Outlet, redirect, useLoaderData, useOutletContext } from "react-router-dom";
import { useState } from "react";
import { Box, Toolbar } from "@mui/material";
import { refreshAccessToken } from "../services/services";
import Sidebar from "../components/sidebar/Sidebar";
import AuthNavbar from "../components/navbar/AuthNavbar";
import Cookies from "js-cookie";
import axios from "axios";

const fetchCourses = async () => {
    const access = Cookies.get("access");

    const response = await axios.get("http://localhost:8080/api/account/profile/courses/", {
        headers: {
            Authorization: `Bearer ${access}`
        }
    });

    return response;
}

export async function drawerLoader() {
    try {
        const coursesResponse = await fetchCourses();
        
        return coursesResponse.data;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            try {
                await refreshAccessToken();
                const coursesResponse = await fetchCourses();

                return coursesResponse.data;
            } catch (refreshError) {
                Cookies.remove("access");
                Cookies.remove("refresh");
                Cookies.remove("video");
                console.log("Drawer: ", refreshError.response.data);
                return redirect("/login");
            }
        } else {
            console.log(error.response.data);
        }
    }
}

function DrawerLayout() {
    const { profile, courses } = useOutletContext();
    const [mobileOpen, setMobileOpen] = useState();

    const handleDrawerClose = () => {
        setMobileOpen(!mobileOpen);
    }

    return (
        <Box sx={{ display: 'flex' }}>
            <AuthNavbar handleClick={handleDrawerClose} />
            <Sidebar open={mobileOpen} handleClose={handleDrawerClose} />
            <Box
                component="main"
                sx={{ flexGrow: 1, width: { sm: `calc(100% - 240px)` }}}
            >
                <Toolbar />
                <Outlet context={{ profile: profile, courses: courses }} />
            </Box>
        </Box>
    );
}

export default DrawerLayout;