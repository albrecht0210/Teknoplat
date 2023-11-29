import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { storeMeeting } from "../features/data/meetingSlice";


function MeetingLayout() {
    const { meetings } = useSelector((state) => state.meeting);
    const { paths } = useSelector((state) => state.path);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Retrieve Location
    const location = useLocation();
    const currentUrl = location.pathname;

    useEffect(() => {
        const urlPatterns = currentUrl.split("/meetings");
        // If current url is "/courses/.../meetings" or "/courses/.../meetings/" then navigate back to course page 
        // else store to meeting
        if (urlPatterns[1] === '' || urlPatterns[1] === "/") {
            navigate(urlPatterns[0]);
        } else {
            // If meetings is not empty then find meeting url in paths then store to meeting
            if (meetings.length !== 0) {
                const foundPath = paths.find((path) => path.to === currentUrl);
                const meeting = meetings.find((meeting) => meeting.name === foundPath.name);
                dispatch(storeMeeting({ meeting: meeting }))
            }
        }
    }, [dispatch, navigate, paths, meetings, currentUrl]);

    return(
        <Outlet />
    );
}

export default MeetingLayout;
