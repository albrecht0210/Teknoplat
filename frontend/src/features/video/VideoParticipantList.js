import { IconButton, List, ListItem, ListItemButton, ListItemText, ListSubheader, Paper } from "@mui/material";
import { useSelector } from "react-redux";
import ToggleOffIcon from '@mui/icons-material/ToggleOff';

function VideoParticipantList({ participants }) {
    const { members } = useSelector((state) => state.course);
    console.log(members)
    const listParticipants = [...participants.keys()];

    let inMeeting = [];
    let notInMeeting = [];

    listParticipants.forEach((participantID) => {
        const memberInMeeting = members.find((member) => member.id === participantID);

        if (memberInMeeting) {
            inMeeting.push(memberInMeeting);
        } else {
            notInMeeting.push(participantID); // Add the participant ID to notInMeeting if not found in members
        }
    });

    const membersNotInMeeting = []
    
    members.forEach((member) => {
        const memberFound = inMeeting.find((memberInMeeting) => memberInMeeting.id === member.id);

        if (!memberFound) {
            membersNotInMeeting.push(member);
        }
    });

    const foundTeachers = inMeeting.filter((member) => member.role === "Teacher");
    const foundStudents = inMeeting.filter((member) => member.role === "Student");
    
    return (
        <Paper sx={{ width: "100%", height: "calc(100vh - 48px - 56px - 24px)" }}>
            <List 
                sx={{ 
                    height: "100%",
                    overflow: "auto",
                    scrollbarWidth: "thin",
                    "&::-webkit-scrollbar": {
                        width: "8px",
                    },
                    "&::-webkit-scrollbar-thumb": {
                        backgroundColor: (theme) => theme.palette.primary.main,
                        opacity: "50%",
                        borderRadius: "4px",
                    },
                    "&::-webkit-scrollbar-track": {
                        backgroundColor: (theme) => theme.palette.background.paper,
                    },
                }}
            >
                <ListSubheader sx={{ backgroundColor: "inherit", position: "relative" }}>
                    Teachers
                </ListSubheader>
                { foundTeachers.map((teacher) => (
                    <ListItem 
                        key={teacher.id} 
                        disablePadding
                        secondaryAction= {
                            <IconButton edge="end" aria-label="toggle">
                              <ToggleOffIcon />
                            </IconButton>
                        }
                    >
                        <ListItemButton>
                            <ListItemText primary={teacher.full_name}/>
                        </ListItemButton>
                    </ListItem>
                )) }
                <ListSubheader sx={{ backgroundColor: "inherit" }}>
                    Students
                </ListSubheader>
                { foundStudents.map((student) => (
                    <ListItem 
                        key={student.id} 
                        secondaryAction= {
                            <IconButton edge="end" aria-label="toggle">
                              <ToggleOffIcon />
                            </IconButton>
                        }
                        disablePadding
                    >
                        <ListItemButton>
                            <ListItemText primary={student.full_name}/>
                        </ListItemButton>
                    </ListItem>
                )) }
                <ListSubheader sx={{ backgroundColor: "inherit" }}>
                    Related Members
                </ListSubheader>
                { membersNotInMeeting.map((member) => (
                    <ListItem key={member.id} disablePadding>
                        <ListItemButton>
                            <ListItemText primary={member.full_name}/>
                        </ListItemButton>
                    </ListItem>
                )) }
            </List>
        </Paper>
    );
}

export default VideoParticipantList;