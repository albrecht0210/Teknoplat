import { Button, Paper, Stack, Typography } from '@mui/material';
import axios from 'axios';
import Cookies from 'js-cookie';
import React from 'react'
import { useOutletContext } from 'react-router-dom';

const updateOpenPitchRate = async (pitch) => {
    const access = Cookies.get("access");
    const data = {
        ...pitch,
        open_rate: true
    }

    const response = await axios.put(`http://localhost:8008/api/pitches/${[pitch.id]}/`, data, {
        headers: {
            Authorization: `Bearer ${access}`
        }
    });

    return response;
}


let PresentorCard = ({ pitch, isStudent, handleOpen }) => {
    const handleOpenRateClick = (pitch) => {
        updateOpenPitchRate(pitch);
    }

    const handleRateClick = (pitch) => {
        localStorage.setItem("pitch", pitch.id);
        handleOpen();
    }

    return (
        <Paper elevation={4} sx={{ p: 1, pl: 2 }} >
            <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography>{pitch.name}</Typography>
                { isStudent && !pitch.open_rate && <Button disabled>Rate</Button> }
                { isStudent && pitch.open_rate && <Button onClick={() => handleRateClick(pitch)}>Rate</Button> }
                { !isStudent && pitch.open_rate && <Button onClick={() => handleRateClick(pitch)}>Rate</Button> }
                { !isStudent && !pitch.open_rate && <Button onClick={() => handleOpenRateClick(pitch)}>Open</Button> }
            </Stack>
        </Paper>
    );
}

function RatePanel(props) {
    const { meeting, handleOpen } = props;
    const { profile } = useOutletContext();

    console.log(meeting);
    
    return (
        <Paper sx={{ p: 2, height: "calc(100vh - 72px - 48px - 24px)", width: "300px" }}>
            <Stack spacing={1}>
                {meeting.presentors.map((presentor) => (
                    <PresentorCard key={presentor.id} pitch={presentor} isStudent={profile.role === "Student"} handleOpen={handleOpen} />
                ))}
            </Stack>
        </Paper>
    )
}

export default RatePanel;