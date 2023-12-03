import { Box, Button, Paper, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";
import { redirect, useLoaderData, useLocation, useNavigate } from "react-router-dom";
import { refreshAccessToken } from "../../services/services";
import { useEffect, useState } from "react";
import { formatStringToUrl } from "../../utils/helper";

const fetchMeetings = async (url) => {
    const access = Cookies.get("access");

    const response = await axios.get(url, {
        headers: {
            Authorization: `Bearer ${access}`
        }
    });

    return response;
}

export async function meetingsLoader({ request, params }) {
    const originalUrl = request.url;
    const baseUrl = "http://localhost:3000/";
    const course = localStorage.getItem("course");
    const currentUrl = originalUrl.replace(baseUrl, '');
    const urlParts = currentUrl.split("meetings/");
    let status;
    if (urlParts[1] === "" || urlParts[1] === "in_progress") {
        localStorage.setItem("statusTabValue", 1);
        status = "in_progress";
    } else if (urlParts[1] === "pending") {
        localStorage.setItem("statusTabValue", 0);
        status = "pending";
    } else if (urlParts[1] === "completed") {
        localStorage.setItem("statusTabValue", 2);
        status = "completed";
    } else {
        return redirect("/");
    }

    try {
        const meetingsResponse = await fetchMeetings(`http://localhost:8008/api/meetings/?limit=5&offset=0&course=${course}&status=${status}`);

        return meetingsResponse.data;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            try {
                await refreshAccessToken();
                const meetingsResponse = await fetchMeetings(`http://localhost:8008/api/meetings/?limit=5&offset=5&course=${course}&status=${status}`);
                
                return meetingsResponse.data;
            } catch (refreshError) {
                Cookies.remove("access");
                Cookies.remove("refresh");
                Cookies.remove("video");
                return redirect("/login");
            }
        } else {
            console.log(error.response.data);
        }
    }
}

let MeetingRow = ({ meeting }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleMeetingClick = (meeting) => {
        const currentUrl = location.pathname;
        const urlPath = currentUrl.split("meetings/");
        const url = `${urlPath[0]}meetings/${formatStringToUrl(meeting.name)}`;
        localStorage.setItem("meeting", meeting.id);
        localStorage.setItem("videoId", meeting.video);
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

let MeetingRowSkeleton = () => {
    return (
        <TableRow>
            <TableCell>
                <Skeleton variant="rounded" />
            </TableCell>
            <TableCell>
                <Skeleton variant="rounded" />
            </TableCell>
            <TableCell>
                <Skeleton variant="rounded" />
            </TableCell>
            <TableCell>
                <Skeleton variant="rounded" />
            </TableCell>
        </TableRow>
    )
}

function MeetingTable() {
    const data = useLoaderData();

    const [meetings, setMeetings] = useState(data.results);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, [loading]);

    useEffect(() => {
        setMeetings(data.results);
    }, [data]);

    let content;

    if (loading) {
        content = [0, 1, 2, 3, 4, 5].map((item) => (
            <MeetingRowSkeleton key={item} />
        ));
    } else {
        content = meetings.map((meeting) => (
            <MeetingRow key={meeting.id} meeting={meeting} />
        ));
    }

    return (
        <Box p={5}>
            <Paper>
                <TableContainer 
                    sx={{ 
                        height: "calc(100vh - 64px - 48px - 48px - 80px - 52px - 1px)",
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
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ width: "calc(100% * 0.09)", opacity: 0.9 }}></TableCell>
                                <TableCell sx={{ opacity: 0.9 }}>Title</TableCell>
                                <TableCell sx={{ width: "calc(100% * 0.2)", opacity: 0.9 }}>Teacher Score Weight</TableCell>
                                <TableCell sx={{ width: "calc(100% * 0.2)", opacity: 0.9 }}>Student Score Weight</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            { content }
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={data.count}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    // onPageChange={handleChangePage}
                    // onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </Box>
    );
}

export default MeetingTable;
