import { Box, Divider, Drawer, List, ListItem, ListItemButton, ListItemText, ListSubheader } from "@mui/material";
import { redirect, useNavigate } from "react-router-dom";
import Logo from "../Logo";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import AccountOption from "./AccountOption";
import CoursesList from "./CoursesList";
import { useState } from "react";

let SidebarOptions = ({ courses, open, handleCoursesClick }) => {
    const handleDashboardClick = () => {
        redirect("/");
    }

    return (
        <>
            <Logo />
            <Divider />
            <List>
                <ListSubheader component="div">
                    Main
                </ListSubheader>
                <ListItem disablePadding>
                    <ListItemButton onClick={handleDashboardClick}>
                        <ListItemText primary="Dashboard" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton onClick={handleCoursesClick}>
                        <ListItemText primary="Courses"/>
                        { open ? <ExpandLess /> : <ExpandMore /> }
                    </ListItemButton>
                </ListItem>
                <CoursesList courses={courses} open={open} />
                <Divider />
                <ListSubheader component="div">
                    Application
                </ListSubheader>
                <ListItem disablePadding>
                    <ListItemButton>
                        <ListItemText primary="Settings" />
                    </ListItemButton>
                </ListItem>
            </List>
            <Divider sx={{ mt: "auto" }} />
            <AccountOption />
        </>
    );
}

function Sidebar(props) {
    const { courses, window, open, profile, handleClose } = props;

    const [coursesOpen, setCoursesOpen] = useState(true);

    const handleCoursesOptionClick = () => {
        setCoursesOpen(!coursesOpen);
    }

    const container = window !== undefined ? () => window().document.body : undefined;
    
    return (
        <Box
            component="nav"
            sx={{ width: { sm: 240 }, flexShrink: { sm: 0 } }}
            aria-label="teknoplat links"
        >
            <Drawer
                sx={{
                    display: { xs: 'block', sm: 'none' },
                    '& .MuiDrawer-paper': { width: 240, boxSizing: 'border-box' }
                }}
                container={container}
                open={open}
                variant="temporary"
                onClose={handleClose}
                ModalProps={{
                    keepMounted: true,
                }}
            >
                <SidebarOptions profile={profile} open={coursesOpen} handleCoursesClick={handleCoursesOptionClick} />
            </Drawer>
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: 'none', sm: 'block' },
                    '& .MuiDrawer-paper': { width: 240, boxSizing: 'border-box' },
                }}
                open
            >
                <SidebarOptions courses={courses} open={coursesOpen} handleCoursesClick={handleCoursesOptionClick} />
            </Drawer>
        </Box>
    );
}

export default Sidebar;