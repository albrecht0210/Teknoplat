import { Button, Paper, Stack, Typography } from '@mui/material';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom';
import { formatStringToUrl } from '../../utils/helper';

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


let PresentorCard = ({ socket, pitch, isStudent, handleOpen }) => {
    const handleOpenRateClick = async (pitch) => {
        try {
            await updateOpenPitchRate(pitch);
            socket.send(JSON.stringify({
                'pitch': pitch.id
            }));
        } catch (error) {

        }
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
    const { enqueueSnackbar } = useSnackbar();

    const [socket, setSocket] = useState(null);
    const [pitches, setPitches] = useState(meeting.presentors);

    useEffect(() => {
        const ws = new WebSocket(`ws://127.0.0.1:8008/ws/pitches/${formatStringToUrl(meeting.name)}/`);

        ws.onopen = () => {
            console.log('WebSocket connected');
            setSocket(ws);
        };
        
        ws.onmessage = (event) => {
            const pitchId = JSON.parse(event.data).pitch;
            const updatedPitches = pitches.map((pitch) => pitch.id === pitchId ? { ...pitch, open_rate: true } : pitch);
            console.log(updatedPitches);
            setPitches(updatedPitches);

            const pitchData = pitches.find((pitch) => pitch.id === pitchId);
            enqueueSnackbar(`Rating is now open for ${pitchData.name}.`, { variant: 'info' });
        };

        ws.onclose = () => {
            console.log('WebSocket disconnected');
            setSocket(null);
        };

        return () => {
            ws.close();
        };
    }, [meeting]);
    console.log(pitches);
    return (
        <Paper sx={{ p: 2, height: "calc(100vh - 72px - 48px - 24px)", width: "calc(100vw * 0.25)" }}>
            <Stack spacing={1}>
                {pitches.map((presentor) => (
                    <PresentorCard key={presentor.id} socket={socket} pitch={presentor} isStudent={profile.role === "Student"} handleOpen={handleOpen} />
                ))}
            </Stack>
        </Paper>
    )
}

export default RatePanel;