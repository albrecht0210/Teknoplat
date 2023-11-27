import { Collapse, List, ListItem, ListItemButton, ListItemText, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { storeCourse } from "../../features/data/courseSlice";
import { deStoreHistory } from "../../features/data/pathSlice";

let CourseButton = ({ course }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleCourseClick = (course) => {
        dispatch(storeCourse({ course: course }));
        dispatch(deStoreHistory());
        const url = `/courses/${course.code.toLowerCase()}_${course.section.toLowerCase()}`;
        navigate(url);
    }

    return (
        <ListItem disablePadding>
            <ListItemButton sx={{ pl: 4 }} onClick={() => handleCourseClick(course)}>
                <ListItemText
                    primary={`${course.name}`}
                    secondary={`${course.code} - ${course.section}`}
                />
            </ListItemButton>
        </ListItem>
    );
}

let CourseLoadingButton = () => {
    return (
        <ListItem disablePadding>
            <ListItemButton >
                <ListItemText
                    primary={
                        <Typography className="loadingSlide">
                            <span style={{ visibility: "hidden" }}>Loading...</span>
                        </Typography>
                    }
                    secondary={
                        <Typography className="loadingSlide" sx={{ width: "calc(100% / 1.5)" }}>
                            <span style={{ visibility: "hidden" }}>Loading...</span>
                        </Typography>
                    }
                />
            </ListItemButton>
        </ListItem>
    );
}

function CoursesList(props) {
    const { open } = props;
    const { courses } = useSelector((state) => state.course);

    let content;

    if (courses.length === 0) {
    // if (true) {
        content = [1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
            <CourseLoadingButton key={item} />
        ));
    } else {
        content = courses.map((course) => (
            <CourseButton key={course.id} course={course} />
        ));
    }

    return (
        <Collapse in={open}>
            <List 
                sx={{ 
                    maxHeight: "calc(100vh - (64px * 2.8) - (48px * 4) - 16px)", 
                    overflow: "auto",
                    scrollbarWidth: "thin",
                    "&::-webkit-scrollbar": {
                        width: "8px",
                    },
                    "&::-webkit-scrollbar-thumb": {
                        backgroundColor: (theme) => theme.palette.primary.main,
                        borderRadius: "4px",
                    },
                    "&::-webkit-scrollbar-track": {
                        backgroundColor: (theme) => theme.palette.background.paper,
                    },
                }}
            >
                { content }
            </List>
        </Collapse>
    );
}

export default CoursesList; 