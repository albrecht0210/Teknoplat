import { Mic, MicOff, MoreVert, Videocam, VideocamOff } from "@mui/icons-material";
import { Box, Fade, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Paper, Popper, Stack, Typography } from "@mui/material";
import { useMeeting, useParticipant } from "@videosdk.live/react-sdk";
import { useState } from "react";
import { useOutletContext } from "react-router-dom";

let ParticipantButton = ({ member, meeting, isParticipantStudent = false, isAccountStudent = false }) => {
    console.log(member.id);
    const { enableWebcam: remoteEnableWebcam, disableWebcam: remoteDisableWebcam, enableMic, disableMic, webcamOn, micOn } = useParticipant(member.id);
    const { enableWebcam: localEnableWebcam, disableWebcam: localDisableWebcam, unmuteMic, muteMic } = useMeeting({
        onWebcamRequested: ({ accept, reject, participantId }) => {
            // callback function to accept the request
            accept();
        },
        onMicRequested: ({ accept, reject, participantId }) => {
            // callback function to accept the request
            accept();
        },
    });
    
    const handleToggleParticipantWebCam = () => {
        if (webcamOn) {
            remoteDisableWebcam();
            localEnableWebcam();
        } else {
            localDisableWebcam();
            remoteEnableWebcam();
        }
    }

    const handleToggleParticipantMic = () => {
        if (micOn) {
            disableMic();
            unmuteMic();
        } else {
            muteMic();
            enableMic();
        }
    }

    return (
        <ListItem 
            disablePadding
            secondaryAction= {(meeting && isParticipantStudent && !isAccountStudent) && (
                <Stack direction="row" spacing={1}>
                    <IconButton aria-label="toggleMic" onClick={handleToggleParticipantMic}>
                        {micOn ? <Mic /> : <MicOff />}
                    </IconButton>
                    <IconButton aria-label="toggleVideo" onClick={handleToggleParticipantWebCam}>
                        {webcamOn ? <Videocam /> : <VideocamOff />}
                    </IconButton>
                </Stack>
            )}
        >
            <ListItemButton 
                disabled 
                sx={{ 
                    opacity: "1 !important", 
                    userSelect: "text", 
                    cursor: "text !important", 
                    pointerEvents: "auto" 
                }}
            >
                <ListItemText primary={member.full_name}/>
            </ListItemButton>
        </ListItem>
    )
}

function ParticipantPanel(props) {
    const { course, participants } = props;
    const { profile } = useOutletContext();
    
    const [anchorEl, setAnchorEl] = useState(null);
    const [open, setOpen] = useState(false);
    
    const inMeeting = participants.map((participant) => course.members.find((member) => member.id === participant));
    const notInMeeting = course.members.filter((member) => !inMeeting.find((meetingMember) => member.id === meetingMember.id));

    const handleTogglePopper = (event) => {
        setAnchorEl(event.currentTarget);
        setOpen((prev) => anchorEl !== event.currentTarget || anchorEl === null || !prev);
    }


    console.log(inMeeting);
    console.log(notInMeeting);

    return (
        <Paper sx={{ height: "calc(100vh - 72px - 48px - 24px)", width: "calc(100vw * 0.25)" }}>
            {/* <Popper open={open} anchorEl={anchorEl} placement="bottom-end" transition sx={{ zIndex: 999 }}>
                {({ TransitionProps }) => (
                <Fade {...TransitionProps} timeout={350}>
                    <Paper sx={{ backgroundColor: "#454545" }}>
                        <List>
                            <ListItem disablePadding>
                                <ListItemButton>
                                    <ListItemIcon>
                                        <Videocam />
                                    </ListItemIcon>
                                    <ListItemText primary="Turn On Video"/>
                                </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemButton>
                                    <ListItemIcon>
                                        <Mic />
                                    </ListItemIcon>
                                    <ListItemText primary="Turn On Mic"/>
                                </ListItemButton>
                            </ListItem>
                        </List>
                    </Paper>
                </Fade>
                )}
            </Popper> */}
            <List 
                sx={{ 
                    py: 0,
                    height: "100%",
                    overflowY: "hidden",
                    ":hover": {
                        overflowY: "auto",
                        scrollbarWidth: "thin",
                        "&::-webkit-scrollbar": {
                            width: "8px",
                        },
                        "&::-webkit-scrollbar-thumb": {
                            backgroundColor: (theme) => theme.palette.primary.main,
                            borderRadius: "4px",
                        },
                        "&::-webkit-scrollbar-track": {
                            backgroundColor: (theme) => theme.palette.background.paper,
                        },
                    },
                }}
            >
                <ListSubheader sx={{ backgroundColor: "inherit", position: "relative" }}>
                    Teachers
                </ListSubheader>
                {inMeeting.filter((member) => member.role === "Teacher").map((teacher) => (
                    <ParticipantButton key={teacher.id} member={teacher} meeting={true} />
                ))}
                <ListSubheader sx={{ backgroundColor: "inherit" }}>
                    Students
                </ListSubheader>
                {inMeeting.filter((member) => member.role === "Student").map((student) => (
                    <ParticipantButton key={student.id} member={student} meeting={true} isParticipantStudent={true} isAccountStudent={profile.role === "Student"} />
                ))}
                <ListSubheader sx={{ backgroundColor: "inherit" }}>
                    Not In Meeting
                </ListSubheader>
                {notInMeeting.map((member) => (
                    <ParticipantButton key={member.id} member={member} meeting={false} />
                ))}
            </List>
        </Paper>
    );
}

export default ParticipantPanel;
