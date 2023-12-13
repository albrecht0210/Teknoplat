import { Box, Button, Grid, Stack, Typography } from "@mui/material";
import { formatUrlToString } from "../../utils/helper";
import { Form, Outlet, redirect, useLoaderData, useLocation, useNavigate, useOutletContext } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import { refreshAccessToken } from "../../services/services";
import TabContainer from "../../components/tab/TabContainer";
import { useState } from "react";
import CourseMemberList from "./CourseMemberList";
import HistoryDialog from "./HistoryDialog";

const fetchMeeting = async () => {
    const access = Cookies.get("access");
    const meetingId = localStorage.getItem("meeting");
    const response = await axios.get(`http://localhost:8008/api/meetings/${meetingId}/`, {
        headers: {
            Authorization: `Bearer ${access}`
        }
    });

    return response;
}

const updateMeeting = async (meeting, videoID) => {
    const access = Cookies.get("access");
    const data = {
        ...meeting,
        status: "in_progress",
        video: videoID.meetingId
    }
    localStorage.setItem("videoId", videoID.meetingId);

    const response = await axios.put(`http://localhost:8008/api/meetings/${meeting.id}/`, data, {
        headers: {
            Authorization: `Bearer ${access}`
        }
    });
    return response;
}

const createVideoID = async () => {
    const token = Cookies.get("video");
    const access = Cookies.get("access");
    
    const response = await axios.post(`http://localhost:8008/api/video/create-meeting/`, 
        {
            token: token
        }, 
        { 
            headers: {
                Authorization: `Bearer ${access}`
            }
        }
    );

    return response;
}

const validateVideoID = async () => {
    const token = Cookies.get("video");
    const access = Cookies.get("access");
    const videoId = localStorage.getItem("videoId");
    console.log(videoId);
    const response = await axios.post(`http://localhost:8008/api/video/validate-meeting/${videoId}/`, 
        {
            token: token
        }, 
        { 
            headers: {
                Authorization: `Bearer ${access}`
            }
        }
    );

    return response;
}

const fetchOverallRatings = async () => {
    const access = Cookies.get("access");
    const meetingId = localStorage.getItem("meeting");
    
    const response = await axios.get(`http://localhost:8008/api/meeting/ratings/?meeting=${meetingId}`, { 
        headers: {
            Authorization: `Bearer ${access}`
        }
    });

    return response;
}

const fetchFeedbacks = async () => {
    const access = Cookies.get("access");
    const meetingId = localStorage.getItem("meeting");
    
    const response = await axios.get(`http://localhost:8008/api/feedbacks/?meeting=${meetingId}`, { 
        headers: {
            Authorization: `Bearer ${access}`
        }
    });

    return response;
}

export async function meetingLoader({ request, params }) {
    try {
        const meetingResponse = await fetchMeeting();
        let pitchesRatingResponse = { data: [] };
        let feedbacksResponse = { data: [] };

        if (meetingResponse.data.status === "completed") {
            pitchesRatingResponse = await fetchOverallRatings();
            feedbacksResponse = await fetchFeedbacks();
        }
        
        localStorage.setItem("videoId", meetingResponse.data.video);
        return { 
            'meeting': meetingResponse.data,
            'feedbacks': feedbacksResponse.data,
            'pitches': pitchesRatingResponse.data 
        };
    } catch (error) {
        if (error.response && error.response.status === 401) {
            try {
                await refreshAccessToken();
                const meetingResponse = await fetchMeeting();
                const pitchesRatingResponse = await fetchOverallRatings();
                const feedbacksResponse = await fetchFeedbacks();
                
                localStorage.setItem("videoId", meetingResponse.data.video);
                return { 
                    'meeting': meetingResponse.data,
                    'feedbacks': feedbacksResponse.data,
                    'pitches': pitchesRatingResponse.data
                };
            } catch (refreshError) {
                Cookies.remove("access");
                Cookies.remove("refresh");
                Cookies.remove("video");
                return redirect("/login");
            }
        }
        return redirect("/");
    }
}

export async function meetingAction({ request, params }) {
    let formData = await request.formData();
    let intent = formData.get("intent");

    if (intent === "join") {
        try {
            await validateVideoID();
            return redirect(`/live/${params.meetingName}`);
        } catch(error) {
            console.log(error.response.data);
            return error.response.data;
        }
    }

    if (intent === "start") {
        try {
            const meetingResponse = await fetchMeeting();
            const videoResponse = await createVideoID();
            await updateMeeting(meetingResponse.data, videoResponse.data);
            await validateVideoID();
            return redirect(`/live/${params.meetingName}`);
        } catch (error) {
            console.log(error.response.data);
            return error.response.data;
        }
    }

}

function MeetingPage() {
    const { meeting, pitches, feedbacks } = useLoaderData();
    console.log(meeting);
    console.log(pitches);
    console.log(feedbacks);
    const { profile } = useOutletContext();

    const navigate = useNavigate();
    const location = useLocation();
    const currentUrl = location.pathname;
    const urlPath = currentUrl.split("meetings/");
    const meetingPath = urlPath[1].split("/");

    const [openHistoryDialog, setOpenHistoryDialog] = useState(false);

    let actionButton;

    const handleHistoryView = async () => {
        setOpenHistoryDialog(true);
    }

    if (meeting.status === "in_progress") {
        actionButton = (
            <Form method="post">
                <Button type="submit" name="intent" value="join" variant="contained">Join</Button>
            </Form>
        );
    } else if (meeting.status === "pending") {
        if (profile?.role === "Student") {
            actionButton = <Button variant="contained" disabled>Start</Button>;
        } else {
            actionButton = (
                <Form method="post">
                    <Button type="submit" name="intent" value="start" variant="contained">Start</Button>
                </Form>
            );
        }
    } else if (meeting.status === "completed") {
        actionButton = <Button variant="contained" onClick={handleHistoryView}>View</Button>;
    }

    const tabOptions = [
        { value: 0, name: "Pitch", stringValue: "pitch" },
        { value: 1, name: "Criteria", stringValue: "criteria" },
        { value: 2, name: "Comments", stringValue: "comments" }
    ];

    const initTabValue = localStorage.getItem("meetingTabValue") ? Number(localStorage.getItem("meetingTabValue")) : 0;
    const [meetingTabValue, setMeetingTabValue] = useState(initTabValue);

    const handleTabChange = (event, value) => {
        const option = tabOptions.find((option) => option.value === value);
        localStorage.setItem("meetingTabValue", value);
        setMeetingTabValue(value);
        const url = `${urlPath[0]}meetings/${meetingPath[0]}/${option.stringValue}`;
        console.log(url);
        navigate(url);
    }

    const handleHistoryDialogClose = () => {
        setOpenHistoryDialog(false);
    }

    return (
        <Box>
            <Grid
                container
                spacing={2}
            >
                <Grid item sm={12} md={8}>
                    <Stack spacing={3} sx={{ mb: 3 }}>
                        <Stack direction="row" spacing={5}>
                            <Typography variant="h5">{ meeting.name }</Typography>
                            { actionButton }
                        </Stack>
                        <Typography fontWeight={100} variant="h6">{ meeting.description }</Typography>
                    </Stack>
                    <TabContainer 
                        tabOptions={tabOptions}
                        handleChange={handleTabChange}
                        selected={meetingTabValue}
                    />
                    <Outlet context={{ profile: profile, meeting: meeting }} />
                </Grid>
                <Grid item sm={12} md={4}>
                    <CourseMemberList />
                </Grid>
            </Grid>
            <HistoryDialog 
                open={openHistoryDialog} 
                handleClose={handleHistoryDialogClose}
                meeting={meeting}
                pitches={pitches}
                feedbacks={feedbacks}
            />
        </Box>
    );
}

export default MeetingPage;
