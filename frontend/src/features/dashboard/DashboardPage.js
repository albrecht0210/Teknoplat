import { Box, Button, Paper, Skeleton, Stack, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useOutletContext } from "react-router-dom";
import { storeCourse } from "../data/courseSlice";
import { deStoreHistory } from "../data/pathSlice";
import { storeStatus } from "../data/meetingSlice";
import { useEffect, useState } from "react";

// Course Card
let DashboardCard = ({ course }) => {
    const navigate = useNavigate();

    const handleCourseClick = (course) => {
        // dispatch(storeCourse({ course: course }));
        // dispatch(deStoreHistory());
        // dispatch(storeStatus({ status: "in_progress" }));
        localStorage.setItem("course", course.id);
        const url = `/courses/${course.code.toLowerCase()}_${course.section.toLowerCase()}/meetings/`;
        navigate(url);
    }

    return (
        <Paper
            component={Button}
            sx={{ 
                height: "calc((100vh - 64px - 50px) * 0.35)", 
                width: "calc((100vw - 280px) * 0.3)",
                p: 3
            }}
            onClick={() => handleCourseClick(course)}
        >
            <Stack spacing={1} sx={{ width: "100%" }}>
                <Typography variant="h4">{ course.code }</Typography>
                <Typography variant="h6">{ course.name } ({ course.section })</Typography>
            </Stack>
        </Paper>
    );
}

let DashboardCardSkeleton = () => {
    return (
        <Paper
            component={Button}
            sx={{ 
                height: "calc((100vh - 64px - 50px) * 0.35)", 
                width: "calc((100vw - 280px) * 0.3)",
                p: 3
            }}
        >
            <Stack spacing={1} sx={{ width: "100%" }}>
                <Typography variant="h3"><Skeleton animation="wave" /></Typography>
                <Typography variant="h5"><Skeleton animation="wave" /></Typography>
            </Stack>
        </Paper>
    );
}

function DashboardPage() {
    // Retrieve courses from store
    // const { courses } = useSelector((state) => state.course);
    const { courses } = useOutletContext();
    
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    let content;
    // If courses is empty load DashboardLoadingCard else DashboardCard
    // if (courses.length === 0) {
    if (loading) {
        content = [1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
            <DashboardCardSkeleton key={item} />
        ));
    } else {
        content = courses.map((course) => (
            <DashboardCard course={course} key={course.id} />
        ));
    }

    return (
        <Box p={3}>
            <Stack direction="row" spacing={3} useFlexGap flexWrap="wrap">
                { content }
            </Stack>
        </Box>
    );
}

export default DashboardPage;
