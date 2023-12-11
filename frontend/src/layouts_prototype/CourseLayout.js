import { Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, FormGroup, Stack, TextField, Typography } from "@mui/material";
import { Outlet, redirect, useLoaderData, useLocation, useNavigate, useOutletContext } from "react-router-dom";
import TabContainer from "../components/tab/TabContainer";
import SearchInput from "../features/course/SearchInput";
import { useState } from "react";
import { refreshAccessToken } from "../services/services";
import Cookies from "js-cookie";
import axios from "axios";

const fetchCourse = async (code, section) => {
    const access = Cookies.get("access");

    const response = await axios.get(`http://localhost:8080/api/account/profile/course/?code=${code}&section=${section}`, {
        headers: {
            Authorization: `Bearer ${access}`
        }
    });

    return response;
}

const fetchTeams = async () => {
  const access = Cookies.get("access");

  const response = await axios.get(`http://localhost:8080/api/teams/?course=${localStorage.getItem("course")}`, {
      headers: {
          Authorization: `Bearer ${access}`
      }
  });

  return response;
}

const addActivityMeeting = async (name, description, account) => {
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

const updateActivityMeeting = async (teacherWeightScore, studentWeightScore, presentors) => {
    const access = Cookies.get("access");

    const meetingResponse = await axios.get(`http://localhost:8008/api/meetings/?course=${localStorage.getItem("course")}&status=pending`, {
        headers: {
            Authorization: `Bearer ${access}`
        }
    });
    const meeting = meetingResponse.data[meetingResponse.data.length - 1];
    
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

export async function courseLoader({ request, params }) {
    const courseParams = params.courseCodeAndSection.split("_");
    const code = courseParams[0].toUpperCase();
    const section = courseParams[1].toUpperCase();

    try {
        const courseResponse = await fetchCourse(code, section);
        const teamResponse = await fetchTeams();

        localStorage.setItem("course", courseResponse.data.id);
        return { course: courseResponse.data, teams: teamResponse.data  };
    } catch (error) {
        if (error.response && error.response.status === 401) {
            try {
                await refreshAccessToken();
                const courseResponse = await fetchCourse(code, section);
                
                localStorage.setItem("course", courseResponse.data.id);
                return courseResponse.data;
            } catch (refreshError) {
                Cookies.remove("access");
                Cookies.remove("refresh");
                Cookies.remove("video");
                return redirect("/login");
            }
        }
        return redirect("/");
    }
}

function CourseLayout() {
    const data = useLoaderData();
    const { profile } = useOutletContext();

    const navigate = useNavigate();
    const location = useLocation();
    const currentUrl = location.pathname;
    const urlPath = currentUrl.split("meetings/");
    const validUrl = ["", "pending", "in_progress", "completed"];

    const tabOptions = [
        { value: 0, name: "Pending", stringValue: "pending" },
        { value: 1, name: "In Progress", stringValue: "in_progress" },
        { value: 2, name: "Completed", stringValue: "completed" }
    ];
    const initTabValue = localStorage.getItem("statusTabValue") ? Number(localStorage.getItem("statusTabValue")) : 1;
    const [statusTabValue, setStatusTabValue] = useState(initTabValue);
    const [searchMeeting, setSearchMeeting] = useState(localStorage.getItem("searchMeeting") ?? "");
    const [openCreateDialog, setOpenCreateDialog] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        descripton: "",
        teacher_weight_score: "",
        student_weight_score: "",
        checked: data.teams.map(() => false),
        presentors: []
    });

    const handleChangeChecked = (e, position) => {
        const prevPosCheck = formData.checked[position];
        const checked = formData.checked.map((check, index) => index === position ? !check : check);

        const team = data.teams[position];
        const currentPosCheck = checked[position];
        console.log(position)
        console.log(prevPosCheck)
        console.log(currentPosCheck)
        console.log(!prevPosCheck && currentPosCheck)
        let presentors;
        if (!prevPosCheck && currentPosCheck) {
          presentors = formData.presentors.concat([team.id])
        } else {
          formData.presentors.splice(position, 1);
          presentors = formData.presentors;          
        }
        console.log(presentors);
        const finalPresentors = presentors;
        setFormData((previous) => ({
          ...previous,
          checked: checked,
          presentors: finalPresentors
        }));
        console.log(formData)
    }

    const handleCloseCreateDialog = () => {
      setOpenCreateDialog(false);
    }

    const handleOpenCreateDialog = () => {
      setOpenCreateDialog(true);
    }

    const handleTabChange = (event, value) => {
        const option = tabOptions.find((option) => option.value === value);
        console.log(option.stringValue);
        localStorage.setItem("statusTabValue", value);
        setStatusTabValue(value);

        navigate(urlPath[0].concat("meetings/".concat(option.stringValue)));
    }

    const handleSearchInput = (event) => {
        localStorage.setItem("searchMeeting", event.target.value);
        setSearchMeeting(event.target.value);
    }

    return (
        validUrl.includes(urlPath[1]) ? (
                <Box p={3}>
                    <TabContainer 
                        tabOptions={tabOptions}
                        handleChange={handleTabChange}
                        selected={statusTabValue}
                        inputField={
                          (
                            <Stack direction="row" spacing={2} alignItems="center" ml="auto">
                              <Button size="small" variant="contained" onClick={handleOpenCreateDialog}>Create</Button>
                              <SearchInput value={searchMeeting} handleChange={handleSearchInput} />
                            </Stack>
                          )
                        }
                    />
                    <Outlet context={{ course: data.course }} />
                    <Dialog open={openCreateDialog} onClose={handleCloseCreateDialog}>
                      <DialogTitle>Create a Meeting</DialogTitle>
                      <DialogContent>
                        <Stack spacing={2}>
                          <TextField label="Title" />
                          <TextField label="Description" />
                          <Stack direction="row" spacing={2}>
                            <TextField label="Teacher Score Weight" />
                            <TextField label="Student Score Weight" />
                          </Stack>
                          <Typography>Select Presentors</Typography>
                          <FormGroup>
                            {data.teams.map((team, index) => (
                              <FormControlLabel key={team.id} control={<Checkbox checked={formData.checked[index]} onChange={(e) => handleChangeChecked(e, index)} value={team.id}/>} label={team.name} />
                            ))}
                          </FormGroup>
                        </Stack>
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={handleCloseCreateDialog}>Cancel</Button>
                        <Button onClick={handleCloseCreateDialog}>Save</Button>
                      </DialogActions>
                    </Dialog>
                </Box>
            ) : (
                <Box p={3}>
                    <Outlet context={{ profile: profile, course: data.course }} />
                </Box>
            )
    );
}

export default CourseLayout;
