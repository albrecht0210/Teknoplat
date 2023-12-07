import { Box, Button, Divider, IconButton, Paper, Stack, Tooltip } from "@mui/material";
import { useMeeting } from "@videosdk.live/react-sdk";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useState } from "react";
import { CallEnd, EditNote, Mic, MicOff, PeopleAlt, ScreenShare, StopScreenShare, VideoChat, Videocam, VideocamOff } from "@mui/icons-material";
import Cookies from "js-cookie";
import axios from "axios";
import OpenAI from 'openai';

const updateMeetingStatusToCompleted = async (meeting) => {
    const access = Cookies.get("access");
    const data = {
        ...meeting,
        status: "completed"
    }

    const response = await axios.put(`http://localhost:8008/api/meetings/${meeting.id}/`, data, {
        headers: {
            Authorization: `Bearer ${access}`
        }
    });

    return response;
}

const getPitchRemarks = async (meeting) => {
    const access = Cookies.get("access");

    const response = await axios.get(`http://localhost:8008/api/meetings/remarks/?meeting=${meeting.id}`, {
        headers: {
            Authorization: `Bearer ${access}`
        }
    });

    return response;
}

const addFeedbackSummary = async (remarks) => {
    let prompt = "Please provide a concise summary of the remarks. Highlight key strengths and areas for improvement mentioned by each evaluator. Provide it into a single paragraph.";

    remarks.forEach(remark => {
        prompt.concat(`\n\n${remark.remark}`);
    });

    const openai = new OpenAI({
        apiKey: "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", // defaults to process.env["OPENAI_API_KEY"]
    });

    const completion = await openai.completions.create({
        model: "gpt-3.5-turbo-instruct",
        prompt: prompt
    });

    const summary = completion.choices[0].text;

    const access = Cookies.get("access");
    const data = {
        pitch: remarks[0].pitch,
        meeting: remarks[0].meeting,
        feedback: summary
    }

    const response = await axios.post(`http://localhost:8008/api/feedbacks/`, data, {
        headers: {
            Authorization: `Bearer ${access}`
        }
    });

    return response;
}

function Controls(props) {
    const { meeting, rate, participant, chat } = props;
    const { profile } = useOutletContext();

    console.log(profile);
    const navigate = useNavigate();

    const onMeetingLeft = () => {
        navigate("/")
    }
    
    const onParticipantLeft = (participant) => {
        if (profile.id === participant) {
            navigate("/");
        }
    }

    const { leave, toggleMic, localMicOn, localScreenShareOn, toggleScreenShare, toggleWebcam, localWebcamOn, end } = useMeeting({
        onMeetingLeft, 
        onParticipantLeft
    });

    const handleToggleCam = () => {
        localStorage.setItem("openWebcam", !localWebcamOn);
        toggleWebcam();
    }

    const handleToggleMic = () => {
        localStorage.setItem("openMic", !localMicOn);
        toggleMic();
    }

    const handleToggleShareScreen = () => {
        localStorage.setItem("openShareScreen", !localScreenShareOn);
        toggleScreenShare();
    }

    const handleEnd = async () => {
        // await updateMeetingStatusToCompleted(meeting);
        // const remarksResponse = await getPitchRemarks(meeting);
        // await addFeedbackSummary(remarksResponse.data);
        end();
        localStorage.removeItem("meeting_chats");
        navigate("/");
    }
    
    const handleLeave = () => {
        leave();
        localStorage.removeItem("meeting_chats");
        navigate("/");
    }

    return (
        <Paper sx={{ py: 2, px: 4 }} >
            <Box display="flex" justifyContent="space-between">
                <Box width="152px" />
                <Stack direction="row" spacing={2}>
                    { profile.role === "Teacher" && (
                        <>
                            {/* <Tooltip title="Screen Share">
                                <IconButton 
                                    aria-label="toggleShareScreen" 
                                    onClick={handleToggleShareScreen}
                                    sx={localScreenShareOn ? {
                                        backgroundColor: "#3c4043", 
                                        color: "white", 
                                        ":hover": {
                                            backgroundColor: "#3c4043"
                                        }
                                    } : { 
                                        backgroundColor: "#ff4313", 
                                        color: "white", 
                                        ":hover": {
                                            backgroundColor: "#ff430080"
                                        }
                                    }}
                                >
                                    {localScreenShareOn ? <ScreenShare /> : <StopScreenShare />}
                                </IconButton>
                            </Tooltip> */}
                            {/* <Tooltip title={onMic ? "Off Mic" : "On Mic"}> */}
                            <Tooltip title="Mic">
                                <IconButton 
                                    aria-label="toggleMic" 
                                    onClick={handleToggleMic}
                                    sx={localMicOn ? {
                                        backgroundColor: "#3c4043", 
                                        color: "white", 
                                        ":hover": {
                                            backgroundColor: "#3c4043"
                                        }
                                    } : { 
                                        backgroundColor: "#ff4313", 
                                        color: "white", 
                                        ":hover": {
                                            backgroundColor: "#ff430080"
                                        }
                                    }}
                                >
                                    {localMicOn ? <Mic /> : <MicOff />}
                                </IconButton>
                            </Tooltip>
                            {/* <Tooltip title={onCam ? "Off Cam" : "On Cam"}> */}
                            <Tooltip title="Video">
                                <IconButton 
                                    aria-label="toggleWebcam" 
                                    onClick={handleToggleCam}
                                    sx={localWebcamOn ? {
                                        backgroundColor: "#3c4043", 
                                        color: "white", 
                                        ":hover": {
                                            backgroundColor: "#3c4043"
                                        }
                                    } : { 
                                        backgroundColor: "#ff4313", 
                                        color: "white", 
                                        ":hover": {
                                            backgroundColor: "#ff430080"
                                        }
                                    }}
                                >
                                    {localWebcamOn ? <Videocam /> : <VideocamOff />}
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="End Call">
                                <IconButton 
                                    onClick={handleEnd} 
                                    aria-label="endCall" 
                                    sx={{ 
                                        backgroundColor: "#ff4313", 
                                        color: "white", 
                                        ":hover": {
                                            backgroundColor: "#ff430080"
                                        }
                                    }}
                                >
                                    <CallEnd />
                                </IconButton>
                            </Tooltip>
                        </>
                    ) }
                    { profile.role === "Student" && (
                        <>
                            <Tooltip title="Leave Call">
                                <IconButton 
                                    onClick={handleLeave} 
                                    aria-label="leaveCall" 
                                    sx={{ 
                                        backgroundColor: "#ff4313", 
                                        color: "white", 
                                        ":hover": {
                                            backgroundColor: "#ff430080"
                                        }
                                    }}
                                >
                                    <CallEnd />
                                </IconButton>
                            </Tooltip>
                        </>
                    ) }
                </Stack>
                <Stack direction="row" spacing={2}>
                    <Tooltip title="Rate" enterDelay={300}>
                        <IconButton 
                            onClick={rate.handleToggleRate} 
                            aria-label="toggleRate" 
                            color={rate.onRate ? "primary": "default"}
                        >
                            <EditNote />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Participant" enterDelay={300}>
                        <IconButton 
                            onClick={participant.handleToggleParticipants}
                            aria-label="toggleParticipants"
                            color={participant.onParticipant ? "primary": "default"}
                        >
                            <PeopleAlt />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Chat" enterDelay={300}>
                        <IconButton 
                            onClick={chat.handleToggleVideoChat}
                            aria-label="toggleVideoChat"
                            color={chat.onVideoChat ? "primary": "default"}
                        >
                            <VideoChat />
                        </IconButton>
                    </Tooltip>
                </Stack>
            </Box>
            {/* <Stack direction="row" spacing={3}>
                <Stack direction="row" spacing={2}>
                    <IconButton aria-label="toggleMic">
                        <MicIcon />
                    </IconButton>
                    <IconButton aria-label="toggleWebcam">
                        <VideocamIcon />
                    </IconButton>
                </Stack>
                <button onClick={() => toggleMic()}>toggleMic</button>
                <button onClick={() => toggleWebcam()}>toggleWebcam</button> 
                <Divider sx={{ color: "grey" }} />
                <Stack direction="row" spacing={2}>
                    <IconButton onClick={handleRatePanelButtonClick} aria-label="toggleRate">
                        <EditNoteIcon />
                    </IconButton>
                    <IconButton onClick={handleParticipantPanelButtonClick} aria-label="toggleParticipants">
                        <PeopleAltIcon />
                    </IconButton>
                </Stack>
                <Divider sx={{ color: "grey" }} />
                { profile?.role === "Teacher" && (
                    <IconButton onClick={handleEnd} aria-label="endCall" sx={{ backgroundColor: "red" }}>
                        <CallEndIcon />
                    </IconButton>
                )}
                { profile?.role === "Student" && (
                    <IconButton onClick={handleLeave} aria-label="leaveCall" sx={{ backgroundColor: "red" }}>
                        <CallEndIcon />
                    </IconButton>
                )}
            </Stack> */}
        </Paper>
    );
}

export default Controls;