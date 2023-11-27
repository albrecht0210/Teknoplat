import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { storeCourse } from "../data/courseSlice";
import { deStoreHistory } from "../data/pathSlice";
import { storeStatus } from "../data/meetingSlice";

let DashboardCard = ({ course }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleCourseClick = (course) => {
        dispatch(storeCourse({ course: course }));
        dispatch(deStoreHistory());
        dispatch(storeStatus({ status: "in_progress" }));
        localStorage.removeItem("searchMeeting");
        const url = `/courses/${course.code.toLowerCase()}_${course.section.toLowerCase()}`;
        navigate(url);
    }

    return (
        <Paper
            component={Button}
            sx={{ 
                height: "calc((100vh - 64px - 50px) * 0.35)", 
                width: "calc((100vw - 320px) * 0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center"
            }}
            onClick={() => handleCourseClick(course)}
        >
            <Stack spacing={3}>
                <Typography variant="h4">{ course.code }</Typography>
                <Typography variant="h6">{ course.name } ({ course.section })</Typography>
            </Stack>
        </Paper>
    );
}

let DashboardLoadingCard = () => {
    return (
        <Paper
            sx={{ 
                height: "calc((100vh - 64px - 50px) * 0.35)", 
                width: "calc((100vw - 320px) * 0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center"
            }}
        >
            <Stack spacing={3}>
                <Typography variant="h4" className="loadingSlide">
                    <span style={{ visibility: "hidden" }}>CSIT441</span>
                </Typography>
                <Typography variant="h6" className="loadingSlide">
                    <span style={{ visibility: "hidden" }}>Software Engineering (F2)</span>
                </Typography>
            </Stack>
        </Paper>
    );
}


function DashboardPage() {
    const { courses } = useSelector((state) => state.course);

    let content;

    if (courses.length === 0) {
    // if (true) {
        content = [1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
            <DashboardLoadingCard key={item} />
        ));
    } else {
        content = courses.map((course) => (
            <DashboardCard course={course} key={course.id} />
        ));
    }

    return (
        <Box>
            <Stack direction="row" spacing={3} useFlexGap flexWrap="wrap">
                { content }
            </Stack>
        </Box>
    );
}

export default DashboardPage;
