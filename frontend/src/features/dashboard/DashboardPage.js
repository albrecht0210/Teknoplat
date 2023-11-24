import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { formatStringToUrl } from "../../utils/helper";
import { storeCourse } from "../data/courseSlice";

let DashboardCard = ({ course }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleCourseClick = (course) => {
        dispatch(storeCourse({ course: course }));
        navigate(`/${formatStringToUrl(course.name)}`);
        // navigate(`/courses/${formatStringToUrl(course.name)}`);
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
                position: 'relative',
                overflow: 'hidden',
                background: '#333',
                color: '#fff',
                "@keyframes loading": {
                    "0%": {
                        backgroundPosition: "-500px 0",
                    },
                    "100%": {
                        backgroundPosition: "500px 0"
                    }
                },
                '&:before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    background: `linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.08), transparent)`,
                    animation: 'loading 2s infinite linear',
                },
            }}
        />
    );
}


function DashboardPage() {
    const { courses } = useSelector((state) => state.course);

    let content;

    if (courses.length === 0) {
        content = [1, 2, 3, 4].map((item) => (
            <DashboardLoadingCard key={item} />
        ));
    } else {
        content = courses.map((course) => (
            <DashboardCard course={course} key={course.id} />
        ));
    }

    return (
        <Box>
            <Stack direction="row" spacing={3}>
                { content }
            </Stack>
        </Box>
    );
}

export default DashboardPage;
