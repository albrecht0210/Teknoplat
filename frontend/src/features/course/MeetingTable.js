import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { useSelector } from "react-redux";

let MeetingRow = ({ meeting }) => {
    return (
        <TableRow>
            <TableCell>
                <Button
                    variant="contained"
                    size="small"
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
            <TableCell />
        </TableRow>
    );
}

function MeetingTable(props) {
    const { search, status, loading } = props;
    const { meetings } = useSelector((state) => state.meeting);

    let content;

    if (loading && meetings.length === 0) {
        content = [0, 1, 2].map((item) => (
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
        <TableContainer component={Paper}>
            <Table aria-label="meeting-table">
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