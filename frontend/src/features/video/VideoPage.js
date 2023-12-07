import { Box } from "@mui/material";
import { MeetingProvider } from "@videosdk.live/react-sdk";
import MeetingView from "./MeetingView";
import { refreshAccessToken } from "../../services/services";
import Cookies from "js-cookie";
import axios from "axios";
import { redirect, useLoaderData, useOutletContext } from "react-router-dom";

const fetchMeeting = async () => {
    const access = Cookies.get("access");
    const meetingId = localStorage.getItem("meeting");
    const response = await axios.get(`http://localhost:8008/api/meetings/${meetingId}/`, {
        headers: {
            Authorization: `Bearer ${access}`
        }
    });

    return response;
}

const fetchTeams = async () => {
    const access = Cookies.get("access");
    const courseId = localStorage.getItem("course");
    const response = await axios.get(`http://localhost:8080/api/teams/?course=${courseId}`, {
        headers: {
            Authorization: `Bearer ${access}`
        }
    });

    return response;
}

export async function videoLoader({ request, params }) {
    try {
        const meetingResponse = await fetchMeeting();
        const teamsResponse = await fetchTeams();

        localStorage.setItem("videoId", meetingResponse.data.video);
        
        const modifiedPitchesData = meetingResponse.data.presentors.map((pitch) => ({ ...pitch, team: teamsResponse.data.find((team) => team.id === pitch.team) }))
        const modifiendMeeting = { ...meetingResponse.data, presentors: modifiedPitchesData };

        return modifiendMeeting;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            try {
                await refreshAccessToken();
                const meetingResponse = await fetchMeeting();
                const teamsResponse = await fetchTeams();

                localStorage.setItem("videoId", meetingResponse.data.video);
        
                const modifiedPitchesData = meetingResponse.data.presentors.map((pitch) => ({ ...pitch, team: teamsResponse.data.find((team) => team.id === pitch.team) }))
                const modifiendMeeting = { ...meetingResponse.data, presentors: modifiedPitchesData };

                return modifiendMeeting;
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

export async function action({ request, params }) {
}

function VideoPage() {
    const meeting = useLoaderData();
    const { profile } = useOutletContext();
    const video = Cookies.get("video");

    const openMic = localStorage.getItem("openMic");
    const openWebcam = localStorage.getItem("openWebcam");

    return (
        <Box height="100vh">
            <MeetingProvider
                config={{
                    meetingId: meeting.video,
                    micEnabled: openMic === "true" ? true : false,
                    webcamEnabled: openWebcam === "true" ? true : false,
                    name: profile.full_name,
                    participantId: profile.id,
                }}
                token={video}
            >
                <MeetingView meeting={meeting} />
            </MeetingProvider>
        </Box>
    );
}

export default VideoPage;
