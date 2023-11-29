import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import TabContainer from "../../components/tab/TabContainer";
import { useDispatch, useSelector } from "react-redux";
import { storeMeetingsOnCourse, storeStatus } from "../data/meetingSlice";
import SearchInput from "./SearchInput";
import TabPanel from "../../components/tab/TabPanel";
import MeetingTable from "./MeetingTable";
import { Outlet, useLocation } from "react-router-dom";
import { useGetMeetingsByCourseQuery } from "../api/apiSlice";
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
    // Retrieve status from store
    const { status } = useSelector((state) => state.meeting);

    const dispatch = useDispatch();

    // Retrieve location
    const location = useLocation();
    const currentUrl = location.pathname;

    const tabOptions = [
        { value: 0, name: "Pending", stringValue: "pending" },
        { value: 1, name: "In Progress", stringValue: "in_progress" },
        { value: 2, name: "Completed", stringValue: "completed"}
    ];

    const initialTabValue = tabOptions.find((option) => option.stringValue === status);

    const [tabValue, setTabValue] = useState(initialTabValue.value);
    const [search, setSearch] = useState(localStorage.getItem("searchMeeting") ? localStorage.getItem("searchMeeting") : "");
    
    const handleTabChange = (event, value) => {
        const tabOption = tabOptions.find((option) => option.value === value);
        dispatch(storeStatus({ status: tabOption.stringValue }));
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
                    <MeetingTable search={search} status={option.stringValue} />
                </TabPanel>
            )) }
        </Box>
    );


}

export default CoursePage;