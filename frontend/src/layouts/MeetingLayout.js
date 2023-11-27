import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { storeMeeting } from "../features/data/meetingSlice";
import { useGetMeetingCriteriaQuery, useGetMeetingPitchesQuery } from "../features/api/apiSlice";
import { storePitches } from "../features/data/pitchSlice";
import { storeCriterias } from "../features/data/criteriaSlice";

function MeetingLayout() {
    const { meetings, meeting } = useSelector((state) => state.meeting);
    const { paths } = useSelector((state) => state.path);
    const { data: pitches = [], isSuccess: pitchFetchSuccess, refetch: refetchPitches } = useGetMeetingPitchesQuery({ id: meeting?.id });
    const { data: criteria = [], isSuccess: criteriaFetchSucces, refetch: refetchCriteria } = useGetMeetingCriteriaQuery({ id: meeting?.id })

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const currentUrl = location.pathname;

    useEffect(() => {
        const urlPatterns = currentUrl.split("/meetings");
        if (urlPatterns[1] === '' || urlPatterns[1] === "/") {
            navigate(urlPatterns[0]);
        }

        if (meetings.length !== 0) {
            const foundPath = paths.find((path) => path.to === currentUrl);
            const meeting = meetings.find((meeting) => meeting.name === foundPath.name);
            dispatch(storeMeeting({ meeting: meeting }))
        }
    }, [dispatch, navigate, paths, meetings, currentUrl]);

    useEffect(() => {
        if (meeting !== null) {
            refetchPitches();
            refetchCriteria();
        }
    }, [refetchPitches, refetchCriteria, meeting]);

    useEffect(() => {
        if (pitchFetchSuccess) {
            dispatch(storePitches({ pitches: pitches }));
        }
    }, [dispatch, pitches, pitchFetchSuccess]);

    useEffect(() => {
        if (criteriaFetchSucces) {
            dispatch(storeCriterias({ criterias: criteria }));
        }
    }, [dispatch, criteria, criteriaFetchSucces]);

    return(
        <Outlet />
    );
}

export default MeetingLayout;