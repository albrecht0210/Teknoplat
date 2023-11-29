import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { storeCourse, storeCourseMembers } from "../features/data/courseSlice";
import { storeStatus } from "../features/data/meetingSlice";
import { useGetCourseMembersQuery } from "../features/api/apiSlice";

function CourseLayout() {
    // Retrieve courses and course from store
    const { courses, course } = useSelector((state) => state.course);

    // Retrieve paths from store
    const { paths } = useSelector((state) => state.path);

    // Fetch course members
    const { data: members = [], isSuccess, refetch } = useGetCourseMembersQuery({ id: course?.id });

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Retrieve location
    const location = useLocation();
    const currentUrl = location.pathname;

    useEffect(() => {
        // If courses is not empty check location
        if (courses.length !== 0) {
            // If the current url is only "/courses"
            // navigate to the first path seen in paths
            // else find the course from courses using the current url
            if (currentUrl === "/courses") {
                const path = paths.find((path) => path.type === "course");
                navigate(path.to);
            } else {
                const course_detail = currentUrl.split("/")[2].split("_");
                const foundCourse = courses.find((course) => course.code === course_detail[0].toUpperCase() && course.section === course_detail[1].toUpperCase());
                
                dispatch(storeCourse({ course: foundCourse }));
            }
        }
    }, [dispatch, navigate, paths, courses, currentUrl]);

    useEffect(() => {
        // If course is not null refetch course members
        if (course !== null) {
            refetch();
        }
    }, [refetch, course]);

    useEffect(() => {
        // If success in fetching course members, store members to store
        if (isSuccess) {
            dispatch(storeCourseMembers({ members: members }));
        }
    }, [dispatch, members, isSuccess]);

    useEffect(() => {
        dispatch(storeStatus({ status: "in_progress" }));
        localStorage.removeItem("searchMeeting");
    }, [dispatch, currentUrl]);


    return(
        <Outlet />
    );
}

export default CourseLayout;