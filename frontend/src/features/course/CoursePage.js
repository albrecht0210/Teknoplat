import { Typography } from "@mui/material";
import { useState } from "react";

function CoursePage() {
    const { status } = useSelector((state) => state.meeting);

    const tabOptions = [
        { value: 0, name: "Pending" },
        { value: 1, name: "In Progress" },
        { value: 2, name: "Completed" }
    ];

    const [tabValue, setTabValue] = useState(status);
    const [search, setSearch] = useState("");
    
    return (
        <Typography>CoursePage</Typography>
    );


}

export default CoursePage;