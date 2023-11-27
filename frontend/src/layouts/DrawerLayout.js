import { Box, Toolbar } from "@mui/material";
import Sidebar from "../components/sidebar/Sidebar";
import AuthNavbar from "../components/navbar/AuthNavbar";
import { Outlet, useLocation } from "react-router-dom";
import { useGetAccountCoursesQuery } from "../features/api/apiSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { storeCourses } from "../features/data/courseSlice";
import { storeCoursePaths, storeCurrent } from "../features/data/pathSlice";

function DrawerLayout() {
    const { paths } = useSelector((state) => state.path);
    const { data: courses = [], isSuccess, isError, refetch } = useGetAccountCoursesQuery();
    
    const location = useLocation();
    const dispatch = useDispatch();

    const currentUrl = location.pathname;

    useEffect(() => {
        if (isSuccess) {
            dispatch(storeCourses({ courses: courses }));
            
            const coursePaths = courses.map((course) => {
                return {
                    type: "course",
                    name: `${course.name} (${course.section})`,
                    to: `/courses/${course.code.toLowerCase()}_${course.section.toLowerCase()}`
                };
            });

            dispatch(storeCoursePaths({ course: coursePaths }));
        }
    }, [dispatch, courses, isSuccess]);

    useEffect(() => {
        if (isSuccess && paths.length !== 3) {
            if (currentUrl.includes("/meetings")) {
                const urlPatterns = currentUrl.split("/meetings");
                dispatch(storeCurrent({ url: urlPatterns[0] }));
            }
            dispatch(storeCurrent({ url: currentUrl }));
        }
    }, [dispatch, courses, isSuccess, currentUrl, paths]);

    useEffect(() => {
        if (isError) {
            refetch();
        }
    }, [refetch, isError])

    return (
        <Box>
            <Sidebar />
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