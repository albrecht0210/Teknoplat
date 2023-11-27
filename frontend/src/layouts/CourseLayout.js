import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { storeCourse, storeCourseMembers } from "../features/data/courseSlice";
import { storeStatus } from "../features/data/meetingSlice";
import { useGetCourseMembersQuery } from "../features/api/apiSlice";

function CourseLayout() {
    const { courses, course } = useSelector((state) => state.course);
    const { paths } = useSelector((state) => state.path);
    const { data: members = [], isSuccess, refetch } = useGetCourseMembersQuery({ id: course?.id });

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
                dispatch(storeCourse({ course: course}));
            }
        }
    }, [dispatch, navigate, paths, courses, currentUrl]);

    useEffect(() => {
        dispatch(storeStatus({ status: "in_progress" }));
        localStorage.removeItem("searchMeeting");
    }, [dispatch, currentUrl]);

    useEffect(() => {
        if (course !== null) {
            refetch();
        }
    }, [refetch, course]);

    useEffect(() => {
        if (isSuccess) {
            dispatch(storeCourseMembers({ members: members }));
        }
    }, [dispatch, members, isSuccess]);

    return(
        <Outlet />
    );
}

export default CourseLayout;