import { useMeeting } from "@videosdk.live/react-sdk";
import { useEffect, useState } from "react";
import ParticipantView from "./ParticipantView";
import { useSelector } from "react-redux";
import { Box, Collapse, Grid, Slide, Stack } from "@mui/material";
import Controls from "./Controls";
import VideoParticipantList from "./VideoParticipantList";
import { useNavigate } from "react-router-dom";

function MeetingView() {
    //Get the method which will be used to join the meeting.
    //We will also get the participants list to display all participants
    const navigate = useNavigate();

    const { join, participants } = useMeeting({
        onParticipantLeft: (participant) => {
            console.log(" onParticipantLeft", participant);
            navigate("/");
        }
    });
    const [load, setLoad] = useState(true);

    useEffect(() => {
        if (load) {
            setLoad(false);
        } else {
            join();
        }
    }, [load]);
    // join();

    const [ratePanelIsVisible, setRatePanelIsVisible] = useState(false);
    const [participantPanelIsVisible, setParticipantPanelIsVisible] = useState(true);

    const handleRatePanelButtonClick = () => {
        setRatePanelIsVisible((prevIsVisible) => !prevIsVisible);
    }

    const handleParticipantPanelButtonClick = () => {
        setParticipantPanelIsVisible((prevIsVisible) => !prevIsVisible);
    }

    return (
        <Box sx={{ height: "100vh", p: 3, position: "relative" }}>
            <Controls handleRatePanelButtonClick={handleRatePanelButtonClick} handleParticipantPanelButtonClick={handleParticipantPanelButtonClick} />
            <Stack direction="row" spacing={1} sx={{ position: "relative", display: "flex" }}>
                {[...participants.keys()].map((participantId) => (
                    <ParticipantView
                        participantId={participantId}
                        key={participantId}
                    />
                ))}
                <Collapse orientation="horizontal" easing={{ enter: "1", exit: "1" }} in={participantPanelIsVisible}>
                    <VideoParticipantList participants={participants} />
                </Collapse>
            </Stack>
        </Box>
    );
}

export default MeetingView;
