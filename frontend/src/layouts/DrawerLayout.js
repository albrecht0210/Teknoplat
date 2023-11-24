import { Box, Toolbar } from "@mui/material";
import Sidebar from "../components/sidebar/Sidebar";
import AuthNavbar from "../components/navbar/AuthNavbar";
import { Outlet, useLocation } from "react-router-dom";
import { useGetAccountCoursesQuery, useGetProfileQuery } from "../features/api/apiSlice";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { storeProfile } from "../features/data/accountSlice";
import { storeCourse, storeCourses } from "../features/data/courseSlice";

function DrawerLayout() {
    const { data: profile, isLoading: isProfileLoading, isSuccess: isProfileSuccess } = useGetProfileQuery();
    const { data: courses = [], isLoading: isCoursesLoading, isSuccess: isCoursesSuccess } = useGetAccountCoursesQuery();
    
    const location = useLocation();
    const dispatch = useDispatch();

    const currentUrl = location.pathname;
    const urlSegments = currentUrl.split('/').filter(segment => segment !== '');
    
    useEffect(() => {
        if (isProfileSuccess && isCoursesSuccess) {
            dispatch(storeProfile({ profile: profile }));
            dispatch(storeCourses({ courses: courses }));
        }
    }, [dispatch, profile, courses, isProfileSuccess, isCoursesSuccess]);

    useEffect(() => {
        if (isCoursesSuccess) {
            dispatch(storeCourse({ course: courses.find((course) => course.name === urlSegments[0]) }));
        }
    }, [dispatch, courses, isCoursesSuccess, urlSegments]);

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