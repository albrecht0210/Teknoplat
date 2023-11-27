import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { storeCourse } from "../features/data/courseSlice";
import { storeStatus } from "../features/data/meetingSlice";

function CourseLayout() {
    const { courses } = useSelector((state) => state.course);
    const { paths } = useSelector((state) => state.path);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const currentUrl = location.pathname;

    useEffect(() => {
        if (courses.length !== 0) {
            const urlPatterns = currentUrl.split("/");
            if (currentUrl === "/courses") {
                const path = paths.find((path) => path.type === "course");
                navigate(path.to);
            } else {
                const coursePath = urlPatterns[2].split("_");
                const course = courses.find((course) => course.code === coursePath[0].toUpperCase() && course.section === coursePath[1].toUpperCase());
                dispatch(storeCourse({ course: course}))
            }
        }
    }, [dispatch, navigate, paths, courses, currentUrl]);

    useEffect(() => {
        dispatch(storeStatus({ status: "in_progress" }));
        localStorage.removeItem("searchMeeting");
    }, [dispatch, currentUrl]);

    return(
        <Outlet />
    );
}

export default CourseLayout;