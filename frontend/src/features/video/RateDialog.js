import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, MobileStepper, Paper, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import TabContainer from "../../components/tab/TabContainer";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import Cookies from "js-cookie";
import axios from "axios";
import { useOutletContext } from "react-router-dom";

const addPitchRating = async (rating, account, criteria) => {
    const access = Cookies.get("access");
    const pitchID = localStorage.getItem("pitch");
    const meetingID = localStorage.getItem("meeting");

    const data = {
        rating: rating,
        account: account,
        pitch: pitchID,
        meeting: meetingID,
        criteria: criteria,
    }

    const response = await axios.post(`http://localhost:8008/api/ratings/`, data, {
        headers: {
            Authorization: `Bearer ${access}`
        }
    });

    return response;
}

const addPitchFeedback = async (remark, account) => {
    const access = Cookies.get("access");
    const pitchID = localStorage.getItem("pitch");
    const meetingID = localStorage.getItem("meeting");

    const data = {
        remark: remark,
        account: account,
        pitch: pitchID,
        meeting: meetingID,
    }

    const response = await axios.post(`http://localhost:8008/api/remarks/`, data, {
        headers: {
            Authorization: `Bearer ${access}`
        }
    });

    return response;
}

let FeedbackTab = ({ profile }) => {
    const [remark, setRemark] = useState("");

    const handleChangeValue = (e) => {
        const {value} = e.target;

        setRemark(value);
    }

    const handleSave = async () => {
        const account = profile.id;
        try {
            await addPitchFeedback(remark, account);
        } catch (error) {

        }
    }

    return (
        <Stack spacing={2} alignItems="center">
            <TextField
                id="feedbackTextField"
                label="Feedback"
                onChange={handleChangeValue}
                value={remark}
                multiline
                fullWidth
                rows={8}
                maxRows={8}
            />
            <Button onClick={handleSave} sx={{ width: 100 }}>Save</Button>
        </Stack>
    );
}

let RatingStepperTab = ({ profile, criterias }) => {
    const [activeStep, setActiveStep] = useState(0);

    const initialFormData = criterias.reduce((acc, criteria) => {
        acc[criteria.name] = "";
        return acc;
    }, {});

    console.log(initialFormData);

    const [formData, setFormData] = useState(initialFormData);
    const maxSteps = criterias.length;

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };
    
    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleChangeValue = (e) => {
        const { name, value } = e.target;

        setFormData((previousFormData) => ({
            ...previousFormData,
            [name]: value
        }));
    }

    const handleSave = async () => {
        const rating = Number(formData[criterias[activeStep].name]);
        const account = profile.id;
        const criteria = criterias[activeStep].criteria;
        try {
            await addPitchRating(rating, account, criteria);
            if (activeStep !== maxSteps - 1) {
                handleNext();
            }
        } catch (error) {

        }
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Paper
                square
                elevation={0}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    height: 50,
                    pl: 2,
                    bgcolor: 'background.default',
                }}
            >
                <Typography>{criterias[activeStep].name}</Typography>
            </Paper>
            <Box sx={{ width: '100%', p: 2, height: "calc(500px - 64px - 32px - 48px - 16px - 50px - 48px - 52.5px - 3px)" }}> 
                <Stack spacing={2}>
                    <Typography>{criterias[activeStep].description}</Typography>
                    <Stack direction="row" spacing={2} justifyContent="center">
                        <TextField onChange={handleChangeValue} value={formData[criterias[activeStep].name]} name={criterias[activeStep].name} label="Input Value"/>
                        <Button onClick={handleSave}>Save</Button>
                    </Stack>
                </Stack>
            </Box>
            <MobileStepper
                variant="text"
                steps={maxSteps}
                position="static"
                activeStep={activeStep}
                nextButton={
                    <Button
                        size="small"
                        onClick={handleNext}
                        disabled={activeStep === maxSteps - 1}
                    >
                        Next <KeyboardArrowRight />
                    </Button>
                }
                backButton={
                    <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                        <KeyboardArrowLeft />Back
                    </Button>
                }
            />
        </Box>

    )
}

function RateDialog(props) {
    const { open, handleClose, meeting } = props;
    
    const pitchID = localStorage.getItem("pitch");
    const pitch = meeting.presentors.find((presentor) => presentor.id === Number(pitchID));
    const { profile } = useOutletContext();

    const tabOptions = [
        { value: 0, name: "Rate", stringValue: "rate" },
        { value: 1, name: "Feedback", stringValue: "feedback" },
    ];
    const [dialogTabValue, setDialogTabValue] = useState(0);

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
        >
            <DialogTitle>{pitch?.name}</DialogTitle>
            <DialogContent dividers>
                <TabContainer 
                    tabOptions={tabOptions}
                    handleChange={handleTabChange}
                    selected={dialogTabValue}
                />
                <Box pt={2}>
                    {dialogTabValue === 0 && <RatingStepperTab profile={profile} criterias={meeting.criteria} />}
                    {dialogTabValue === 1 && <FeedbackTab profile={profile} />}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button disabled>Done</Button>
            </DialogActions>
        </Dialog>
    );
}

export default RateDialog;