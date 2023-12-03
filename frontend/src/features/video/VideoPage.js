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

export async function videoLoader({ request, params }) {
    try {
        const meetingResponse = await fetchMeeting();

        localStorage.setItem("videoId", meetingResponse.data.video);
        return meetingResponse.data;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            try {
                await refreshAccessToken();
                const meetingResponse = await fetchMeeting();

                localStorage.setItem("videoId", meetingResponse.data.video);
                return meetingResponse.data;
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

    return (
        <Box height="100vh">
            <MeetingProvider
                config={{
                    meetingId: meeting.video,
                    micEnabled: profile.role === "Teacher" || profile.role === "Admin" ? true : false,
                    webcamEnabled: profile.role === "Teacher" || profile.role === "Admin" ? true : false,
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
