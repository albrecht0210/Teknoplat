import { Box, Button, Divider, IconButton, Paper, Stack } from "@mui/material";
import { useMeeting } from "@videosdk.live/react-sdk";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import VideocamIcon from '@mui/icons-material/Videocam';
import MicIcon from '@mui/icons-material/Mic';
import CallEndIcon from '@mui/icons-material/CallEnd';
import EditNoteIcon from '@mui/icons-material/EditNote';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';

function Controls(props) {
    const { handleRatePanelButtonClick, handleParticipantPanelButtonClick } = props;
    const navigate = useNavigate();

    const { leave, toggleMic, toggleWebcam, end } = useMeeting(
        {
            onParticipantLeft: (participant) => {
                console.log(" onParticipantLeft", participant);
                navigate("/");
            },
            onConnectionClose: (connectionId) => {
                console.log("ConnectionId", connectionId);
                navigate("/");
            }
        }
    );

    const { profile } = useSelector((state) => state.account);

    const handleEnd = () => {
        end();
        navigate("/");
    }
    
    const handleLeave = () => {
        leave();
        navigate("/");
    }

    return (
        <Paper sx={{ position: "absolute", bottom: 24, left: 0, width: "-webkit-fill-available", p: 2, mx: 3, zIndex: 900 }} >
            <Stack direction="row" spacing={3} justifyContent="end">
                <Stack direction="row" spacing={2}>
                    <IconButton aria-label="toggleMic">
                        <MicIcon />
                    </IconButton>
                    <IconButton aria-label="toggleWebcam">
                        <VideocamIcon />
                    </IconButton>
                </Stack>
                {/* <button onClick={() => toggleMic()}>toggleMic</button> */}
                {/* <button onClick={() => toggleWebcam()}>toggleWebcam</button> */}
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
            </Stack>
        </Paper>
    );
}

export default Controls;