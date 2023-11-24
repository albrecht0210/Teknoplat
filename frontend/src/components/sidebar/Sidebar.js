import { Divider, Drawer, List, ListItem, ListItemButton, ListItemText, ListSubheader } from "@mui/material";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Logo from "../Logo";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import AccountOption from "./AccountOption";
import CoursesList from "./CoursesList";
import { useState } from "react";
import { deStoreCourse } from "../../features/data/courseSlice";

function Sidebar(props) {
    const { profileLoading, coursesLoading } = props;
    
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [isCoursesOptionClicked, setIsCoursesOptionClicked] = useState(true);

    const handleDashboardClick = () => {
        dispatch(deStoreCourse());
        navigate("/");
    }

    const handleCoursesOptionClick = () => {
        setIsCoursesOptionClicked(!isCoursesOptionClicked);
    }

    return (
        <Drawer
            sx={{
                width: 240,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: 240,
                    boxSizing: 'border-box'
                }
            }}
            variant="permanent"
            anchor="left"
        >
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
                    <ListItemButton onClick={handleCoursesOptionClick}>
                        <ListItemText primary="Courses"/>
                        { isCoursesOptionClicked ? <ExpandLess /> : <ExpandMore /> }
                    </ListItemButton>
                </ListItem>
                {/* <CoursesList loading={true} open={isCoursesOptionClicked} /> */}
                <CoursesList loading={coursesLoading} open={isCoursesOptionClicked} />

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

            {/* <AccountOption loading={true} /> */}
            <AccountOption loading={profileLoading} />
        </Drawer>
    );
}

export default Sidebar;