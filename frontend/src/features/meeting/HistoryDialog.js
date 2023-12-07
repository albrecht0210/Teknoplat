import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Paper, Stack, Typography } from "@mui/material";
import { useState } from "react";
import TabContainer from "../../components/tab/TabContainer";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

let OverallView = ({ pitches }) => {
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Rating Summary',
            },
        },
        scales: {
            y: {
                beginAtZero: true
            }
        }
    };

    const labels = pitches.map((pitch) => pitch.name);

    const data = {
        labels,
        datasets: [
            {
                label: "Overall Score",
                data: labels.map((label) => pitches.find((pitch) => pitch.name === label).overall),
                backgroundColor: 'rgba(255, 99, 132, 0.5)'
            }
        ]
    }

    return (
        <Box p={3}>
            <Bar options={options} data={data} />
        </Box>
    );
}

let PitchView = ({ pitch, feedback }) => {
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Rating Summary',
            },
        },
    };

    const labels = pitch.ratings.map((rating) => rating.account.full_name);
    console.log(feedback);
    const data = {
        labels,
        datasets: [
            {
                label: "Score",
                data: labels.map((label) => pitch.ratings.find((rating) => rating.account.full_name === label).total),
                backgroundColor: 'rgba(255, 99, 132, 0.5)'
            }
        ]
    }

    return (
        <Box p={3}>
            <Stack spacing={2}>
                <Bar options={options} data={data} />
                <Paper sx={{ p: 3 }}>
                    <Typography variant="body1" textAlign="justify">{feedback.feedback}</Typography>
                </Paper>
            </Stack>
        </Box>
    );
}

function HistoryDialog(props) {
    const { open, handleClose, meeting, pitches, feedbacks } = props;

    const presentors = meeting.presentors;

    let tabOptions = [
        { value: 0, name: "Overall" },
    ];

    console.log(pitches);
    const tabPitchOptions = presentors.map((pitch, index) => { return {value: (index + 1), name: pitch.name }});
    console.log(tabPitchOptions);

    tabOptions = tabOptions.concat(tabPitchOptions);

    const [dialogTabValue, setDialogTabValue] = useState(0);
    console.log(tabOptions);

    const handleTabChange = (event, value) => {
        const option = tabOptions.find((option) => option.value === value);
        console.log(option.stringValue);
        setDialogTabValue(value);
    }

    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { width: '80%', height: 500 } }}
            maxWidth="sm"
            open={open}
            onClose={handleClose}
            keepMounted={false}
        >
            <DialogTitle>{meeting.name}</DialogTitle>
            <DialogContent dividers>
                <TabContainer 
                    tabOptions={tabOptions}
                    handleChange={handleTabChange}
                    selected={dialogTabValue}
                />
                {dialogTabValue === 0 && <OverallView pitches={pitches} />}
                {dialogTabValue !== 0 && <PitchView pitch={pitches[dialogTabValue - 1]} feedback={feedbacks.find((feedback) => feedback.pitch === pitches[dialogTabValue - 1].id)} />}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button disabled>Done</Button>
            </DialogActions>
        </Dialog>
    );
}

export default HistoryDialog;
