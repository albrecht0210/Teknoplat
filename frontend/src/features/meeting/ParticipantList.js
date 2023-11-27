import { List, ListItem, ListItemButton, ListItemText, ListSubheader, Paper, Typography } from "@mui/material";
import { useSelector } from "react-redux";

let Member = ({ member }) => {
    return (
        <ListItem disablePadding>
            <ListItemButton>
                <ListItemText primary={member.full_name}/>
            </ListItemButton>
        </ListItem>
    )
}

let MemberLoading = () => {
    return (
        <ListItem disablePadding>
            <ListItemButton>
                <ListItemText
                    primary={
                        <Typography className="loadingSlide">
                            <span style={{ visibility: "hidden" }}>Loading...</span>
                        </Typography>
                    }
                />
            </ListItemButton>
        </ListItem>
    )
}

function ParticipantList() {
    const { members } = useSelector((state) => state.course);

    let content;

    if (members.length === 0) {
        content = [0,1,2,3,4].map((item) => (
            <MemberLoading key={item} />
        ));
    } else {
        let teacherMembers = members
            .filter((member) => member.role.toLowerCase().includes("teacher"))
            .map((member) => (
                <Member key={member.id} member={member} />
            ));
        let studentMembers = members
            .filter((member) => member.role.toLowerCase().includes("student"))
            .map((member) => (
                <Member key={member.id} member={member} />
            ));

        content = (
            <>
                <ListSubheader sx={{ backgroundColor: "inherit" }}>
                    Teachers
                </ListSubheader>
                { teacherMembers }
                <ListSubheader sx={{ backgroundColor: "inherit" }}>
                    Students
                </ListSubheader>
                { studentMembers }
            </>
        );
    }

    return (
        <Paper sx={{ height: "100%" }}>
            <List>
                { content }
            </List>
        </Paper>
    );
}

export default ParticipantList;