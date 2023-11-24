import { Collapse, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { storeCourse } from "../../features/data/courseSlice";
import { formatStringToUrl } from "../../utils/helper";

let CourseButton = ({ course }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleCourseClick = (course) => {
        dispatch(storeCourse({ course: course }));
        navigate(`/${formatStringToUrl(course.name)}`);
    }

    return (
        <ListItem disablePadding>
            <ListItemButton sx={{ pl: 4 }} onClick={() => handleCourseClick(course)}>
                <ListItemText
                    primary={`${course.code} ${course.name} (${course.section})`}
                    primaryTypographyProps={{ fontSize: "0.9rem" }}
                />
            </ListItemButton>
        </ListItem>
    );
}

let CourseLoadingButton = () => {
    return (
        <ListItem disablePadding>
            <ListItemButton 
                sx={{
                    position: 'relative',
                    overflow: 'hidden',
                    background: '#333',
                    color: '#fff',
                    "@keyframes loading": {
                        "0%": {
                            backgroundPosition: "-300px 0",
                        },
                        "100%": {
                            backgroundPosition: "300px 0"
                        }
                    },
                    '&:before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      background: `linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.08), transparent)`,
                      animation: 'loading 2s infinite linear',
                    },
                }}
            >
                <ListItemText
                    primary="Loading"
                    primaryTypographyProps={{ fontSize: "0.9rem", visibility: "hidden" }}
                />
            </ListItemButton>
        </ListItem>
    );
}

function CoursesList(props) {
    const { loading, open } = props;
    const { courses } = useSelector((state) => state.course);

    let content;

    if (loading || courses.length === 0) {
        content = [1, 2, 3].map((item) => (
            <CourseLoadingButton key={item} />
        ));
    } else {
        content = courses.map((course) => (
            <CourseButton key={course.id} course={course} />
        ));
    }

    return (
        <Collapse in={open}>
            <List>
                { content }
            </List>
        </Collapse>
    );
}

export default CoursesList;