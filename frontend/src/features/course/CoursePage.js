import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import TabContainer from "../../components/tab/TabContainer";
import { useDispatch, useSelector } from "react-redux";
import { storeMeetingsOnCourse, storeStatus } from "../data/meetingSlice";
import SearchInput from "./SearchInput";
import TabPanel from "../../components/tab/TabPanel";
import MeetingTable from "./MeetingTable";
import { Outlet, useLocation } from "react-router-dom";
import { useGetInProgressMeetingsQuery, useGetMeetingsByCourseQuery, useGetPendingMeetingsQuery } from "../api/apiSlice";
import { storeMeetingPaths } from "../data/pathSlice";
import { formatStringToUrl } from "../../utils/helper";

let CourseRedirect = ({ currentUrl }) => {
    // Retrieve course from store
    const { course } = useSelector((state) => state.course);

    // Fetch meetings via course id
    const { data: meetings = [], isSuccess, refetch } = useGetMeetingsByCourseQuery({ course: course?.id });

    const dispatch = useDispatch();

    useEffect(() => {
        // If course is not null then refetch
        if (course !== null) {
            refetch();
        }
    }, [refetch, course]);

    useEffect(() => {
        // If succes in fetching meetings, store to meetings and store to meeting paths
        if (isSuccess) {
            dispatch(storeMeetingsOnCourse({ meetings: meetings }));
            
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

    return (
        <Outlet />
    );
}

function CoursePage() {
    const [statusTabValue, setStatusTabValue] = useState(localStorage.getItem("statusTabValue") ?? 1);
    const [searchMeeting, setSearchMeeting] = useState(localStorage.getItem("searchMeeting") ?? "");
    const [rowsPerPage, setRowsPerPage] = useState({
        pending: localStorage.getItem("rowsPerPagePending") ?? 5,
        in_progress: localStorage.getItem("rowsPerPageInProgress") ?? 5,
        completed: localStorage.getItem("rowsPerPageCompleted") ?? 5,
    });

    const [page, setPage] = useState({
        pending: localStorage.getItem("pagePending") ?? 0,
        in_progress: localStorage.getItem("pageInProgress") ?? 0,
        completed: localStorage.getItem("pageCompleted") ?? 0,
    });

    const { data: pending_meetings = [] } = useGetPendingMeetingsQuery({ limit: rowsPerPage.pending, offset: (rowsPerPage.pending * (page.pending + 1)) })
    const { data: in_progress_meetings = [] } = useGetInProgressMeetingsQuery({ limit: rowsPerPage.in_progress, offset: (rowsPerPage.in_progress * (page.in_progress + 1)) })
    const { data: completed_meetings = [] } = useGetPendingMeetingsQuery({ limit: rowsPerPage.completed, offset: (rowsPerPage.completed * (page.completed + 1)) })

    const tabOptions = [
        { value: 0, name: "Pending", stringValue: "pending", data: pending_meetings },
        { value: 1, name: "In Progress", stringValue: "in_progress", data: in_progress_meetings },
        { value: 2, name: "Completed", stringValue: "completed", data: completed_meetings }
    ];

    const dispatch = useDispatch();

    // Retrieve location
    const location = useLocation();
    const currentUrl = location.pathname;
    
    const handleTabChange = (event, value) => {
        // const tabOption = tabOptions.find((option) => option.value === value);
        // localStorage(localStorage.setItem("statusTabValue", value));
        // localStorage.removeItem("rowsPerPage");
        // localStorage.removeItem("rowsPerPage");
        setTabValue(value);
    }

    const handleSearchInput = (event) => {
        localStorage.setItem("searchMeeting", event.target.value);
        setSearch(event.target.value);
    }
    
    // If the current url includes /meetings then return this component as CourseRedirect
    if (currentUrl.includes("/meetings")) {
        return (
            <CourseRedirect currentUrl={currentUrl} />
        );
    }

    return (
        <Box height="calc(100% - (64px + 50px))">
            <TabContainer 
                tabOptions={tabOptions}
                handleTabChange={handleTabChange}
                selected={tabValue}
                inputField={
                    <SearchInput value={search} handleChange={handleSearchInput} />
                }
            />
            { tabOptions.map((option, index) => (
                <TabPanel
                    key={index}
                    selected={tabValue}
                    name={option.name}
                    value={option.value}
                    height="calc(100% - 48px)"
                >
                    <MeetingTable meetings={option.data} search={search} />
                </TabPanel>
            )) }
        </Box>
    );
}

export default CoursePage;