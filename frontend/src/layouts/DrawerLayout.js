import { Box, Toolbar } from "@mui/material";
import Sidebar from "../components/sidebar/Sidebar";
import AuthNavbar from "../components/navbar/AuthNavbar";
import { Outlet } from "react-router-dom";
import { useGetAccountCoursesQuery, useGetProfileQuery } from "../features/api/apiSlice";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { storeProfile } from "../features/data/accountSlice";
import { storeCourses } from "../features/data/courseSlice";

function DrawerLayout() {
    const { data: profile, isLoading: isProfileLoading, isSuccess: isProfileSuccess } = useGetProfileQuery();
    const { data: courses = [], isLoading: isCoursesLoading, isSuccess: isCoursesSuccess } = useGetAccountCoursesQuery();

    const dispatch = useDispatch();

    useEffect(() => {
        console.log(isProfileSuccess && isCoursesSuccess);
        if (isProfileSuccess && isCoursesSuccess) {
            dispatch(storeProfile({ profile: profile }));
            dispatch(storeCourses({ courses: courses }));
        }
    }, [dispatch, profile, courses, isProfileSuccess, isCoursesSuccess]);

    return (
        <Box>
            <Sidebar profileLoading={isProfileLoading} coursesLoading={isCoursesLoading} />
            <AuthNavbar />
            <Box
                pl="280px"
                pr="40px"
                height="100vh"
            >
                <Toolbar sx={{ mb: "25px" }} />
                <Outlet />
            </Box>
        </Box>
    );
}

export default DrawerLayout;