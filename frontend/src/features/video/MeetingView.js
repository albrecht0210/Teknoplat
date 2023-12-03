import { useMeeting } from "@videosdk.live/react-sdk";
import { useEffect, useState } from "react";
import ParticipantView from "./ParticipantView";
import { useSelector } from "react-redux";
import { Box, Collapse, Grid, Slide, Stack } from "@mui/material";
import Controls from "./Controls";
import { Outlet, useNavigate, useOutletContext } from "react-router-dom";
import ParticipantPanel from "./ParticipantPanel";

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
    const [slide, setSlide] = useState(false);

    useEffect(() => {
        if (load) {
            setLoad(false);
        } else {
            join();
        }
    }, [load]);

    const testData = [...participants.keys()].map((participantId) => participantId);

    const handleToggleSlide = () => {
        setSlide(!slide);
    }

    console.log(testData);

    const getCourse = courses.find((course) => course.id === Number(localStorage.getItem("course")));

    return (
        <Box height="100vh" p={3}>
            <Stack direction="row" spacing={2} justifyContent="space-around" sx={{ pb: 3 }}>
                <Box />
                <Box>
                    {[...participants.keys()].map((participantId) => (
                        <ParticipantView
                            participantId={participantId}
                            key={participantId}
                        />
                    ))}
                </Box>
                <Collapse in={slide} orientation="horizontal" >
                    {/* <ParticipantPanel /> */}
                    <Outlet context={{ course: getCourse, meeting: meeting }} />
                </Collapse>
                {/* <Slide in={slide} direction="right" container={containerRef.current} mountOnEnter unmountOnExit>
                    <Outlet context={{ course: getCourse, meeting: meeting }} />
                </Slide> */}
            </Stack>
            <Controls handleToggleSlide={handleToggleSlide} />
        </Box>
    );
}

export default MeetingView;
