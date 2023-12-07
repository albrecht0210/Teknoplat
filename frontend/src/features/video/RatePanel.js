import { Button, Paper, Stack, Typography } from '@mui/material';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom';
import { formatStringToUrl } from '../../utils/helper';
import finalPropsSelectorFactory from 'react-redux/es/connect/selectorFactory';

const updateOpenPitchRate = async (pitch) => {
    const access = Cookies.get("access");
    const data = {
        ...pitch,
        team: pitch.team.id,
        open_rate: true
    }

    const response = await axios.put(`http://localhost:8008/api/pitches/${[pitch.id]}/`, data, {
        headers: {
            Authorization: `Bearer ${access}`
        }
    });

    return response;
}


let PresentorCard = ({ socket, pitch, isMember=false, isStudent, handleOpen }) => {
    // const account = pitch.team.members.find((account) => account.id === profile.id)
    // console.log(profile);
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
                { isMember && <Button disabled>Rate</Button> }
                { (isStudent && !pitch.open_rate && !isMember) && <Button disabled>Rate</Button> }
                { (isStudent && pitch.open_rate && !isMember) && <Button onClick={() => handleRateClick(pitch)}>Rate</Button> }
                { (!isStudent && pitch.open_rate && !isMember) && <Button onClick={() => handleRateClick(pitch)}>Rate</Button> }
                { (!isStudent && !pitch.open_rate && !isMember) && <Button onClick={() => handleOpenRateClick(pitch)}>Open</Button> }
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
    const isMember = pitches.find((presentor) => presentor.team.members.find((account) => account.id === profile.id));
    console.log(isMember);

    return (
        <Paper sx={{ p: 2, height: "calc(100vh - 72px - 48px - 24px)", width: "calc(100vw * 0.25)" }}>
            <Stack spacing={1}>
                {pitches.map((presentor) => (
                    <PresentorCard key={presentor.id} socket={socket} isMember={presentor.team.members.find((account) => account.id === profile.id) ? true : false} pitch={presentor} isStudent={profile.role === "Student"} handleOpen={handleOpen} />
                ))}
            </Stack>
        </Paper>
    )
}

export default RatePanel;