import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetMeetingsByCourseAndStatusQuery } from "../api/apiSlice";
import { storeMeeting, storeMeetings } from "../data/meetingSlice";
import { formatStringToUrl } from "../../utils/helper";
import { storeMeetingPaths } from "../data/pathSlice";
import { useLocation, useNavigate } from "react-router-dom";

// Meeting Row Data
let MeetingRow = ({ meeting }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const location = useLocation();
    const currentUrl = location.pathname;

    const handleMeetingClick = (meeting) => {
        dispatch(storeMeeting({ meeting: meeting }));
        const url = `${currentUrl}/meetings/${formatStringToUrl(meeting.name)}`;
        navigate(url);
    }

    return (
        <TableRow>
            <TableCell>
                <Button
                    variant="contained"
                    size="small"
                    onClick={() => handleMeetingClick(meeting)}
                >
                    View
                </Button>
            </TableCell>
            <TableCell>{ meeting.name }</TableCell>
            <TableCell>{ `${meeting.teacher_weight_score * 100}%` }</TableCell>
            <TableCell>{ `${meeting.student_weight_score * 100}%` }</TableCell>
        </TableRow>
    )
}

// Meeting Row Loading
let MeetingLoadingRow = () => {
    return (
        <TableRow>
            <TableCell>
                <Button
                    variant="contained"
                    size="small"
                    className="loadingSlide"
                >
                    <span style={{ visibility: "hidden" }}>View</span>
                </Button>
            </TableCell>
            <TableCell>
                <Typography className="loadingSlide">
                    <span style={{ visibility: "hidden" }}>Loading...</span>
                </Typography>
            </TableCell>
            <TableCell>
                <Typography className="loadingSlide">
                    <span style={{ visibility: "hidden" }}>Loading...</span>
                </Typography>
            </TableCell>
            <TableCell>
                <Typography className="loadingSlide">
                    <span style={{ visibility: "hidden" }}>Loading...</span>
                </Typography>
            </TableCell>
        </TableRow>
    );
}

function MeetingTable(props) {
    const { search, status } = props;

    // Retrieve course from store
    const { course } = useSelector((state) => state.course);

    // Fetch Meetings via course and status
    const { data: meetings = [], isSuccess, refetch } = useGetMeetingsByCourseAndStatusQuery({ course: course?.id, status: status });

    const dispatch = useDispatch();

    useEffect(() => {
        // If course is not null then refetch meetings
        if (course !== null) {
            refetch();
        }
    }, [refetch, course]);

    useEffect(() => {
        // If success in fetching meetings then store to meetings and store to meeting paths
        if (isSuccess) {
            dispatch(storeMeetings({ meetings: meetings }));
            
            const meetingPaths = meetings.map((meeting) => {
                return {
                    type: "meeting",
                    name: `${meeting.name}`,
                    to: `/courses/${course.code.toLowerCase()}_${course.section.toLowerCase()}/meetings/${formatStringToUrl(meeting.name)}`
                };
            });

            dispatch(storeMeetingPaths({ meeting: meetingPaths }));
        }
    }, [dispatch, course, meetings, isSuccess]);

    let content;

    // If meeting is empty then use MeetingLoadingRow component else use the MeetingRow with filtered with search input
    if (meetings.length === 0) {
    // if (true) {
        content = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
            <MeetingLoadingRow key={item} />
        ));
    } else {
        content = meetings
            .filter((meeting) => meeting.name.toLowerCase().includes(search.toLowerCase()))
            .map((meeting) => (
                <MeetingRow meeting={meeting} key={meeting.id} />
            ));
    }

    return (
        <TableContainer component={Paper} sx={{ height: "100%" }}>
            <Table stickyHeader aria-label="meeting-table">
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ width: "calc(100% * 0.09)" }}></TableCell>
                        <TableCell>Title</TableCell>
                        <TableCell sx={{ width: "calc(100% * 0.2)" }}>Teacher Score Weight</TableCell>
                        <TableCell sx={{ width: "calc(100% * 0.2)" }}>Student Score Weight</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    { content }
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default MeetingTable;