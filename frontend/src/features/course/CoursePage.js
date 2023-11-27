import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import TabContainer from "../../components/tab/TabContainer";
import { useDispatch, useSelector } from "react-redux";
import { storeMeetings, storeStatus } from "../data/meetingSlice";
import SearchInput from "./SearchInput";
import TabPanel from "../../components/tab/TabPanel";
import { useGetMeetingsByCourseQuery, useGetMeetingsQuery } from "../api/apiSlice";
import MeetingTable from "./MeetingTable";

function CoursePage() {
    const { status } = useSelector((state) => state.meeting);
    const dispatch = useDispatch();

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
                    handleTabChange={handleTabChange}
                    selected={tabValue}
                    name={option.name}
                    value={option.value}
                    height="calc(100% - 48px)"
                >
                    {/* <Typography>Option {option.value + 1}</Typography> */}
                    <MeetingTable search={search} status={status} />
                </TabPanel>
            )) }
        </Box>
    );


}

export default CoursePage;