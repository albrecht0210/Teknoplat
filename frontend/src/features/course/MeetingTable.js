import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetMeetingsByCourseAndStatusQuery } from "../api/apiSlice";
import { storeMeeting, storeMeetings } from "../data/meetingSlice";
import { formatStringToUrl } from "../../utils/helper";
import { storeMeetingPaths } from "../data/pathSlice";
import { useLocation, useNavigate } from "react-router-dom";

let MeetingRow = ({ meeting }) => {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();

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
            <TableCell>{ (parseFloat(meeting.teacher_weight_score) * 100).toFixed(0) + "%" }</TableCell>
            <TableCell>{ (parseFloat(meeting.student_weight_score) * 100).toFixed(0) + "%" }</TableCell>
        </TableRow>
    )
}

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
    const { course } = useSelector((state) => state.course);

    const { data: meetings = [], isSuccess, refetch } = useGetMeetingsByCourseAndStatusQuery({ course: course?.id, status: status });

    const dispatch = useDispatch();

    useEffect(() => {
        if (course !== null) {
            refetch();
        }
    }, [refetch, course]);

    useEffect(() => {
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

    if (meetings.length === 0) {
    // if (true) {
        content = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
            <MeetingLoadingRow key={item} />
        ));
    } else {
        content = meetings
            .filter((meeting) => meeting.status === status)
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