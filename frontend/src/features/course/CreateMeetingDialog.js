import { Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, FormGroup, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import TabContainer from "../../components/tab/TabContainer";
import Cookies from "js-cookie";
import axios from "axios";

const addActivity = async (name, description, account) => {
    const access = Cookies.get("access");
    const data = {
        name: name,
        description: description,
        status: "pending",
        course: localStorage.getItem("course"),
        service: 3,
        owner: account
    }

    const response = await axios.post(`http://localhost:8001/api/activities/`, data, {
        headers: {
            Authorization: `Bearer ${access}`
        }
    });

    return response;
}

const updateActivityMeeting = async (teacherWeightScore, studentWeightScore, presentors, criterias, meeting_name) => {
    const access = Cookies.get("access");

    const meetingResponse = await axios.get(`http://localhost:8008/api/meeting/retrieve/?name=${meeting_name}`, {
        headers: {
            Authorization: `Bearer ${access}`
        }
    });
    const meeting = meetingResponse.data;
    console.log(meeting);
    presentors.forEach(async (presentor) => {
        const data = {
            pitch: presentor
        }
        await axios.post(`http://localhost:8008/api/meetings/${meeting.id}/add_meeting_presentor/`, data, {
            headers: {
                Authorization: `Bearer ${access}`
            }
        });
    });

    criterias.forEach(async (criteria) => {
        const data = {
            criteria: criteria.criteria,
            weight: Number(criteria.weight)
        }
        await axios.post(`http://localhost:8008/api/meetings/${meeting.id}/add_meeting_criteria/`, data, {
            headers: {
                Authorization: `Bearer ${access}`
            }
        });
    })

    const data = {
      ...meeting,
      teacher_weight_score: teacherWeightScore,
      student_weight_score: studentWeightScore,
    }

    const updateMeetingResponse = await axios.put(`http://localhost:8008/api/meetings/${meeting.id}/`, data, {
        headers: {
            Authorization: `Bearer ${access}`
        }
    });
    return updateMeetingResponse;
}

let PresentorsCheckBoxList = ({ pitches, teams, checked, handleChangeChecked }) => {
    return (
        <FormGroup>
        {pitches.map((pitch, index) => (
            <FormControlLabel 
                key={pitch.id} 
                control={
                    <Checkbox checked={checked[index]} onChange={(e) => handleChangeChecked(e, index)} />
                } 
                label={`${teams.find((team) => team.id === pitch.team).name} - ${pitch.name}`} 
            />
        ))}
        </FormGroup>
    );
}

let CriteriaCheckBoxList = ({ criterias, checked, weights, handleChangeChecked, handleInputChange }) => {
    return (
        <FormGroup>
            {criterias.map((criteria, index) => (
                <Stack key={criteria.id} direction="row" justifyContent="space-between" mb={1}>
                    <FormControlLabel 
                        control={
                            <Checkbox checked={checked[index]} onChange={(e) => handleChangeChecked(e, index)} />
                        } 
                        label={criteria.name} 
                    />
                    <TextField disabled={!checked[index]} sx={{ width: "30%" }} size="small" label="Weight" name="weight" value={weights[index]} onChange={(e) => handleInputChange(e, index)} />
                </Stack>
            ))}
        </FormGroup>
    );
}

function CreateMeetingDialog(props) {
    const { open, pitches, teams, criterias, profile, handleClose } = props;
    const [formData, setFormData] = useState({
        name: "",
        descripton: "",
        teacher_weight_score: "",
        student_weight_score: "",
        checkedPitches: pitches.map(() => false),
        checkedCriterias: criterias.map(() => false),
        criteriaWeights: criterias.map(() => ""),
        presentors: [],
        criterias: []
    });

    const tabOptions = [
        { value: 0, name: "Presentors", stringValue: "presentors" },
        { value: 1, name: "Criteria", stringValue: "criteria" },
    ];

    const [tabValue, setTabValue] = useState(0);

    const handleTabChange = (event, value) => {
        setTabValue(value);
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setFormData((previousFormData) => ({
            ...previousFormData,
            [name]: value
        }));
    }

    const handleInputWeights = (e, position) => {
        const { value } = e.target;
        const weights = formData.criteriaWeights.map((weight, index) => index === position ? value : weight);
        const criteriaList = formData.criterias.map((criteria) => criteria.pos === position ? ({...criteria, weight: weights[position]}) : ({...criteria}));
        setFormData((previousFormData) => ({
            ...previousFormData,
            criteriaWeights: weights,
            criterias: criteriaList
        }));
    }

    const handleChangeCheckedPitches = (e, position) => {
        const prevPosCheck = formData.checkedPitches[position]
        const checked = formData.checkedPitches.map((check, index) => index === position ? !check : check);
        const pitch = pitches[position];
        const currentPosCheck = checked[position];
        let presentors;
        if (!prevPosCheck && currentPosCheck) {
          presentors = formData.presentors.concat([pitch.id])
        } else {
          formData.presentors.splice(position, 1);
          presentors = formData.presentors;          
        }
        const finalPresentors = presentors;
        setFormData((previous) => ({
          ...previous,
          checkedPitches: checked,
          presentors: finalPresentors
        }));
    }

    const handleChangeCheckedCriterias = (e, position) => {
        const prevPosCheck = formData.checkedCriterias[position];
        const checked = formData.checkedCriterias.map((check, index) => index === position ? !check : check);
        const criteria = criterias[position];
        const criteriaWeight = formData.criteriaWeights[position];
        const currentPosCheck = checked[position];
        let criteriasIdList;
        if (!prevPosCheck && currentPosCheck) {
            const criteriaData = { pos: position, criteria: criteria.id, weight: criteriaWeight }
            criteriasIdList = formData.criterias.concat([criteriaData])
        } else {
            const criteriaPos = formData.criterias.findIndex((criteria) => criteria.pos === position)
            formData.criterias.splice(criteriaPos, 1);
            criteriasIdList = formData.criterias;          
        }
        const finalCrtierias = criteriasIdList;
        setFormData((previous) => ({
          ...previous,
          checkedCriterias: checked,
          criterias: finalCrtierias
        }));
    }

    const handleSaveDialog = async () => {
        // console.log(formData);
        const activity = await addActivity(formData.name, formData.descripton, profile.id);
        await updateActivityMeeting(formData.teacher_weight_score, formData.student_weight_score, formData.presentors, formData.criterias, activity.data.name);
        handleClose();
    }

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Create a Meeting</DialogTitle>
            <DialogContent sx={{ width: "calc(100vw * 0.5)", height: "calc(100vh * 0.9)" }}>
                <Stack spacing={2} sx={{ py: 2, px: 1 }}>
                    <TextField label="Title" name="name" value={formData.name} onChange={handleInputChange} />
                    <TextField label="Description" name="descripton" value={formData.descripton} onChange={handleInputChange} />
                    <Stack direction="row" spacing={2}>
                        <TextField fullWidth label="Teacher Score Weight" name="teacher_weight_score" value={formData.teacher_weight_score} onChange={handleInputChange} />
                        <TextField fullWidth label="Student Score Weight" name="student_weight_score" value={formData.student_weight_score} onChange={handleInputChange} />
                    </Stack>
                </Stack>
                <TabContainer 
                    tabOptions={tabOptions}
                    handleChange={handleTabChange}
                    selected={tabValue}
                />
                <Box 
                    px={2} 
                    pt={2} 
                    sx={{ 
                        maxHeight: "calc(100vh * 0.265)",
                        overflowY: "hidden",
                        ":hover": {
                            overflowY: "auto",
                            scrollbarWidth: "thin",
                            "&::-webkit-scrollbar": {
                                width: "8px",
                            },
                            "&::-webkit-scrollbar-thumb": {
                                backgroundColor: (theme) => theme.palette.primary.main,
                                borderRadius: "4px",
                            },
                            "&::-webkit-scrollbar-track": {
                                backgroundColor: (theme) => theme.palette.background.paper,
                            },
                        },
                    }}>
                    {tabValue === 0 && <PresentorsCheckBoxList 
                            pitches={pitches} 
                            teams={teams} 
                            checked={formData.checkedPitches} 
                            handleChangeChecked={handleChangeCheckedPitches} 
                        />
                    }
                    {tabValue === 1 && <CriteriaCheckBoxList 
                            criterias={criterias} 
                            checked={formData.checkedCriterias} 
                            weights={formData.criteriaWeights} 
                            handleChangeChecked={handleChangeCheckedCriterias}
                            handleInputChange={handleInputWeights}
                        />
                    }
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleSaveDialog}>Save</Button>
            </DialogActions>
        </Dialog>
    );
}

export default CreateMeetingDialog;
