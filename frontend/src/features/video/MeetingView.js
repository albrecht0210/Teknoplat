import { useMeeting } from "@videosdk.live/react-sdk";
import { useEffect, useState } from "react";
import ParticipantView from "./ParticipantView";
import { useSelector } from "react-redux";
import { Box, Collapse, Grid, Slide, Stack } from "@mui/material";
import Controls from "./Controls";
import { Outlet, useNavigate, useOutletContext } from "react-router-dom";
import ParticipantPanel from "./ParticipantPanel";
import RatePanel from "./RatePanel";
import RateDialog from "./RateDialog";

function MeetingView(props) {
    const { meeting } = props;
    //Get the method which will be used to join the meeting.
    //We will also get the participants list to display all participants
    const navigate = useNavigate();
    const { courses } = useOutletContext();

    const onParticipantLeft = (participant) => {
        if (meeting.owner === participant) {
            navigate("/");
        }
    }

    const { join, participants } = useMeeting({onParticipantLeft});
    const [load, setLoad] = useState(true);
    const [collapse, setCollapse] = useState(false);
    const [onRate, setOnRate] = useState(false);
    const [onParticipant, setOnParticipant] = useState(false);
    const [onVideoChat, setOnVideoChat] = useState(false);
    const [openRateDialog, setOpenRateDialog] = useState(false);

    useEffect(() => {
        if (load) {
            setLoad(false);
        } else {
            join();
        }
    }, [load]);

    const handleToggleCollapse = () => {
        setCollapse(!collapse);
    }
    
    const handleToggleRate = () => {
        if (collapse && onRate) {
            setCollapse(false)
        } else {
            setCollapse(true)
        }
        if (onRate) {
            setTimeout(() => {
                setOnRate(!onRate);
                setOnParticipant(false);
                setOnVideoChat(false);
            }, 800)
        } else {
            setOnRate(!onRate);
            setOnParticipant(false);
            setOnVideoChat(false);
        }
        
    }

    const handleToggleParticipants = () => {
        if (collapse && onParticipant) {
            setCollapse(false)
        } else {
            setCollapse(true)
        }
        if (onParticipant) {
            setTimeout(() => {
                setOnRate(false);
                setOnParticipant(!onParticipant);
                setOnVideoChat(false);
            }, 800)
        } else {
            setOnRate(false);
            setOnParticipant(!onParticipant);
            setOnVideoChat(false);
        }
    }

    const handleToggleVideoChat = () => {
        handleToggleCollapse();
        setOnRate(false);
        setOnParticipant(false);
        setOnVideoChat(!onVideoChat);
    }

    const handleDialogClose = () => {
        setOpenRateDialog(false);
    }

    const handleDialogOpen = () => {
        setOpenRateDialog(true);
    }

    const getCourse = courses.find((course) => course.id === Number(localStorage.getItem("course")));

    return (
        <Box height="100vh" p={3}>
            <Stack height="calc(100vh - 72px - 24px)" direction="row" spacing={2} justifyContent="space-between" sx={{ pb: 3 }}>
                <Box />
                <Box>
                    {[...participants.keys()].map((participantId) => (
                        <ParticipantView
                            participantId={participantId}
                            key={participantId}
                        />
                    ))}
                </Box>
                <Collapse in={collapse} orientation="horizontal" >
                    {onParticipant && <ParticipantPanel course={ getCourse } participants={[...participants.keys()]}/>}
                    {onRate && <RatePanel meeting={meeting} handleOpen={handleDialogOpen} />}
                    {/* <Outlet context={{ participants: [...participants.keys()], course: getCourse, meeting: meeting }} /> */}
                </Collapse>
            </Stack>
            <Controls 
                meeting={meeting}
                rate={{ onRate, handleToggleRate }} 
                participant={{ onParticipant, handleToggleParticipants }} 
                chat={{ onVideoChat, handleToggleVideoChat }} 
                handleToggleCollapse={handleToggleCollapse}
            />
            <RateDialog open={openRateDialog} handleClose={handleDialogClose} meeting={meeting} />
        </Box>
    );
}

export default MeetingView;
