import { Box, Button, Grid, Stack, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import TabContainer from "../../components/tab/TabContainer";
import { useState } from "react";
import TabPanel from "../../components/tab/TabPanel";
import ParticipantList from "./ParticipantList";
import PitchList from "./PitchList";
import CriteriaList from "./CriteriaList";
import CommentCard from "./CommentCard";

let MeetingDetail = ({ meeting, tabOptions, handleChange, value }) => {
    let actionButton;

    if (meeting.status === "in_progress") {
        actionButton = <Button variant="contained">Join</Button>;
    } else if (meeting.status === "pending") {
        actionButton = <Button variant="contained" disabled>Join</Button>;
    } else if (meeting.status === "completed") {
        actionButton = <Button variant="contained">View</Button>;
    }

    return (
        <>
            <Grid item sm={12} md={8}>
                <Stack spacing={3} sx={{ mb: "24px" }}>
                    <Stack direction="row" spacing={5}>
                        <Typography variant="h5">{ meeting.name }</Typography>
                        { actionButton }
                    </Stack>
                    <Typography fontWeight={100} variant="h6">{ meeting.description }</Typography>
                </Stack>
                <TabContainer
                    tabOptions={tabOptions}
                    handleTabChange={handleChange}
                    selected={value}
                />
                <TabPanel
                    selected={value}
                    name="Pitch"
                    value={0}
                    height="calc(100% - 65.5px - 65.5px - 65.5px)"
                >
                    <PitchList />
                </TabPanel>
                <TabPanel
                    selected={value}
                    name="Criteria"
                    value={1}
                    height="calc(100% - 65.5px - 65.5px - 65.5px)"
                >
                    <CriteriaList />
                </TabPanel>
                <TabPanel
                    selected={value}
                    name="Comment"
                    value={2}
                    height="calc((((100% - 65.5px) - 65.5px) - 65.5px ) - 65.5px)"
                >
                    <CommentCard />
                </TabPanel>
            </Grid>
            <Grid item sm={12} md={4}>
                <ParticipantList />
            </Grid>
        </>
    );
}

let MeetingDetailLoading = ({ tabOptions, handleChange, value }) => {
    return (
        <>
            <Grid item sm={12} md={8}>
                <Stack spacing={3} sx={{ mb: "24px" }}>
                    <Stack direction="row" spacing={5}>
                        <Typography variant="h5" className="loadingSlide">
                            <span style={{ visibility: "hidden" }}>Loading...</span>
                        </Typography>
                        <Button
                            variant="contained"
                            className="loadingSlide"
                        >
                            <span style={{ visibility: "hidden" }}>View</span>
                        </Button>
                    </Stack>
                    <Typography variant="h6" fontWeight={100} className="loadingSlide">
                        <span style={{ visibility: "hidden" }}>Loading...</span>
                    </Typography>
                </Stack>
                <TabContainer
                    tabOptions={tabOptions}
                    handleTabChange={handleChange}
                    selected={value}
                />  
                <TabPanel
                    selected={value}
                    name="Pitch"
                    value={0}
                    height="calc(100% - 65.5px - 65.5px - 65.5px)"
                >
                    <PitchList />
                </TabPanel>
                <TabPanel
                    selected={value}
                    name="Criteria"
                    value={1}
                    height="calc(100% - 65.5px - 65.5px - 65.5px)"
                >
                    <CriteriaList />
                </TabPanel>
                <TabPanel
                    selected={value}
                    name="Comment"
                    value={2}
                    height="calc((((100% - 65.5px) - 65.5px) - 65.5px ) - 65.5px)"
                >
                    <CommentCard />
                </TabPanel>
            </Grid>
            <Grid item sm={12} md={4}>
                <ParticipantList />
            </Grid>
        </>
    );
}

function MeetingPage() {
    const { meeting } = useSelector((state) => state.meeting);
    
    const tabOptions = [
        { value: 0, name: "Pitch" },
        { value: 1, name: "Criteria" },
        { value: 2, name: "Comments" }
    ];

    const [tabValue, setTabValue] = useState(0);

    const handleTabChange = (event, value) => {
        setTabValue(value);
    }
    
    let content;

    if (meeting === null) {
        content = <MeetingDetailLoading tabOptions={tabOptions} handleChange={handleTabChange} value={tabValue} />;
    }  else {
        content = <MeetingDetail meeting={meeting} tabOptions={tabOptions} handleChange={handleTabChange} value={tabValue} />;
    }

    return (
        <Box height="calc(100% - (64px + 50px))">
            <Grid
                container
                spacing={2}
                height="calc(100% - (64px + 100px))"
            >
                { content }
            </Grid>
        </Box>
    );
}

export default MeetingPage;