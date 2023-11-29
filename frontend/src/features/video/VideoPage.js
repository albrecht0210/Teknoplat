import { MeetingProvider } from "@videosdk.live/react-sdk";
import { useSelector } from "react-redux";
import MeetingView from "./MeetingView";

function VideoPage() {
    const { meeting } = useSelector((state) => state.meeting);
    const { profile } = useSelector((state) => state.account);
    const { video } = useSelector((state) => state.auth);

    return (
        <MeetingProvider
            config={{
                meetingId: meeting?.video,
                micEnabled: profile?.role === "Teacher" || profile?.role === "Admin" ? true : false,
                // micEnabled: true,
                webcamEnabled: profile?.role === "Teacher" || profile?.role === "Admin" ? true : false,
                // webcamEnabled: true,
                name: profile?.full_name,
                participantId: profile?.id
            }}
            token={video}
        >
            <MeetingView />
        </MeetingProvider>
    );
}
 
export default VideoPage;