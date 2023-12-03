import { List, ListItem, ListItemButton, ListItemText, ListSubheader, Paper, Skeleton, Typography } from "@mui/material";
import { useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";

let MemberButton = ({ member }) => {
    return (
        <ListItem disablePadding>
            <ListItemButton>
                <ListItemText primary={member.full_name}/>
            </ListItemButton>
        </ListItem>
    )
}

let MemberButtonSkeleton = () => {
    return (
        <ListItem disablePadding>
            <ListItemButton>
                <ListItemText
                    primary={<Skeleton animation="wave" />}
                />
            </ListItemButton>
        </ListItem>
    )
}

function CourseMemberList() {
    const { course } = useOutletContext();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, [loading]);

    // const { members } = useSelector((state) => state.course);

    let content;

    if (loading) {
        content = [0,1,2,3,4].map((item) => (
            <MemberButtonSkeleton key={item} />
        ));
    } else {
        let teacherMembers = course.members
            .filter((member) => member.role.toLowerCase().includes("teacher"))
            .map((member) => (
                <MemberButton key={member.id} member={member} />
            ));
        let studentMembers = course.members
            .filter((member) => member.role.toLowerCase().includes("student"))
            .map((member) => (
                <MemberButton key={member.id} member={member} />
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
        <Paper sx={{ height: "calc(100vh - 64px - 48px)" }}>
            <List>
                { content }
            </List>
        </Paper>
    );
}

export default CourseMemberList;