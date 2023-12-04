import { Box, Button, Divider, IconButton, Paper, Stack, Tooltip } from "@mui/material";
import { useMeeting } from "@videosdk.live/react-sdk";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useState } from "react";
import { CallEnd, EditNote, Mic, MicOff, PeopleAlt, ScreenShare, StopScreenShare, VideoChat, Videocam, VideocamOff } from "@mui/icons-material";

function Controls(props) {
    const { rate, participant, chat } = props;
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

    const { leave, toggleMic, toggleWebcam, end } = useMeeting({onMeetingLeft, onParticipantLeft});

    const [onCam, setOnCam] = useState(true);
    const [onMic, setOnMic] = useState(true);
    const [onShareScreen, setOnShareScreen] = useState(false);
    

    const handleToggleCam = () => {
        toggleWebcam();
        setOnCam(!onCam);
    }

    const handleToggleMic = () => {
        toggleMic();
        setOnMic(!onMic);
    }

    const handleToggleShareScreen = () => {
        setOnShareScreen(!onShareScreen);
    }

    const handleEnd = () => {
        end();
        navigate("/");
    }
    
    const handleLeave = () => {
        leave();
        navigate("/");
    }

    return (
        <Paper sx={{ py: 2, px: 4 }} >
            <Box display="flex" justifyContent="space-between">
                <Box width="152px" />
                <Stack direction="row" spacing={2}>
                    { profile.role === "Teacher" && (
                        <>
                            <Tooltip title={onShareScreen ? "Off ShareScreen" : "On ShareScreen"}>
                                <IconButton aria-label="toggleShareScreen" onClick={handleToggleShareScreen}>
                                    {onShareScreen ? <StopScreenShare /> : <ScreenShare />}
                                </IconButton>
                            </Tooltip>
                            <Tooltip title={onMic ? "Off Mic" : "On Mic"}>
                                <IconButton aria-label="toggleMic" onClick={handleToggleMic}>
                                    {onMic ? <MicOff /> : <Mic />}
                                </IconButton>
                            </Tooltip>
                            <Tooltip title={onCam ? "Off Cam" : "On Cam"}>
                                <IconButton aria-label="toggleWebcam" onClick={handleToggleCam}>
                                    {onCam ? <VideocamOff /> : <Videocam />}
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