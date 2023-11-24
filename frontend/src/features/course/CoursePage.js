import { Box, Typography } from "@mui/material";
import { useState } from "react";
import TabContainer from "../../components/tab/TabContainer";
import { useDispatch } from "react-redux";
import { storeStatus } from "../data/meetingSlice";
import SearchInput from "./SearchInput";
import TabPanel from "../../components/tab/TabPanel";

function CoursePage() {
    const { status } = useSelector((state) => state.meeting);
    const dispatch = useDispatch();

    const tabOptions = [
        { value: 0, name: "Pending" },
        { value: 1, name: "In Progress" },
        { value: 2, name: "Completed" }
    ];

    const [tabValue, setTabValue] = useState(status);
    const [search, setSearch] = useState(localStorage.getItem("searchMeeting") ? localStorage.getItem("searchMeeting") : "");
    
    const handleTabChange = (event, value) => {
        dispatch(storeStatus({ status: value }));
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
            { tabOptions.map((option) => (
                <TabPanel
                    key={option}
                    handleTabChange={handleTabChange}
                    selected={tabValue}
                    name={option.name}
                    value={option.value}
                >
                    <Typography>Option {option}</Typography>
                </TabPanel>
            )) }
        </Box>
    );


}

export default CoursePage;