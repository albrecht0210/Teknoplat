import { Collapse, List, ListItem, ListItemButton, ListItemText, Skeleton } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { storeCourse } from "../../features/data/courseSlice";
import { deStoreHistory } from "../../features/data/pathSlice";
import { useEffect, useState } from "react";

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
            <ListItemButton sx={{ pl: 3 }} onClick={() => handleCourseClick(course)}>
                {/* <ListItemAvatar>
                    <Avatar {...stringAvatar(course.name)} />
                </ListItemAvatar> */}
                <ListItemText
                    primary={`${course.name}`}
                    secondary={`${course.code} - ${course.section}`}
                />
            </ListItemButton>
        </ListItem>
    );
}

let CourseButtonSkeleton = () => {
    return (
        <ListItem disablePadding>
            <ListItemButton sx={{ pl: 3 }} >
                {/* <ListItemAvatar>
                    <Skeleton variant="circular" animation="wave" height={40} width={40} />
                </ListItemAvatar> */}
                <ListItemText
                    primary={<Skeleton animation="wave" />}
                    secondary={<Skeleton animation="wave" width="calc(100% / 1.5)" />}
                />
            </ListItemButton>
        </ListItem>
    )
}

function CoursesList(props) {
    const { courses, open } = props;
    let content;

    // If courses is empty then use CourseLoadingButton else use CourseButton component
    if (courses === null) {
    // if (true) {
        content = [1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
            <CourseButtonSkeleton key={item} />
        ));
    } else {
        content = courses.map((course) => (
            <CourseButton key={course.id} course={course} />
        ));
    }

    return (
        <Collapse 
            in={open}
        >
            <List 
                sx={{ 
                    maxHeight: "calc(100vh - (64px * 2) - (48px * 5) - 32px)",
                    // maxHeight: "calc(100vh - (64px * 2) - (48px * 5) - 35px)", 
                    overflowY: "hidden",
                    ":hover": {
                        overflowY: "auto",
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
                    },
                }}
            >
                { content }
            </List>
        </Collapse>
    );
}

export default CoursesList; 