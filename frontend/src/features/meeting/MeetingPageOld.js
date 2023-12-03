import { Box, Button, Grid, Stack, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import TabContainer from "../../components/tab/TabContainer";
import { useState } from "react";
import TabPanel from "../../components/tab/TabPanel";
import ParticipantList from "./ParticipantList";
import PitchList from "./PitchAccordionList";
import CriteriaList from "./CriteriaList";
import CommentCard from "./CommentCard";
import { useCreateVideoMeetingMutation, useUpdateMeetingMutation, useValidateVideoMeetingMutation } from "../api/apiSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { storeReplaceMeeting } from "../data/meetingSlice";

let MeetingDetail = ({ meeting, tabOptions, handleChange, value }) => {
    const { profile } = useSelector((state) => state.account);
    const { video } = useSelector((state) => state.auth);
    const [createVideoMeeting, { isSuccess: createVideoSuccess }] = useCreateVideoMeetingMutation();
    const [validateVideoMeeting] = useValidateVideoMeetingMutation();
    const [updateMeeting, { isSuccess: updateMeetingSuccess }] = useUpdateMeetingMutation();
    

    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const location = useLocation();
    const currentUrl = location.pathname;

    let actionButton;

    const handleJoinClick = async (meeting) => {
        console.log(meeting.video);
        const data = { credentials: { token: video }, video: meeting?.video };
        await validateVideoMeeting(data)
            .unwrap()
            .then((payload) => {
                const urlPatterns = currentUrl.split("/meetings/");
                navigate(`/video_meet/${urlPatterns[1]}`);
            });
    }

    const handleStartClick = async (meeting) => {
        await createVideoMeeting({ token: video })
            .unwrap()
            .then(async(payload) => {
                const urlPatterns = currentUrl.split("/meetings/");
                if (createVideoSuccess) {
                    const newMeeting = {
                        ...meeting,
                        video: payload.meetingId
                    }
                    dispatch(storeReplaceMeeting({ meeting: newMeeting }));
                    await updateMeeting({ id: meeting.id, meeting: newMeeting }).unwrap();

                    if (updateMeetingSuccess) {
                        navigate(`/video_meet/${urlPatterns[1]}`);
                    }
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    if (meeting.status === "in_progress") {
        actionButton = <Button variant="contained" onClick={() => handleJoinClick(meeting)}>Join</Button>;
    } else if (meeting.status === "pending") {
        if (profile?.role === "Student") {
            actionButton = <Button variant="contained" disabled>Start</Button>;
        } else {
            actionButton = <Button variant="contained" onClick={() => handleStartClick(meeting)}>Start</Button>;
        }
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