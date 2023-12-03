import { Box, Paper } from "@mui/material";
import { useParticipant } from "@videosdk.live/react-sdk";
import { useEffect, useMemo, useRef } from "react";
import ReactPlayer from "react-player";
import { useSelector } from "react-redux";
import { useOutletContext } from "react-router-dom";

function ParticipantView(props) {
    const { participantId } = props;
    const micRef = useRef(null);
    const { courses } = useOutletContext();
    console.log(courses);

    const { webcamStream, micStream, webcamOn, micOn, isLocal, displayName } = useParticipant(participantId);
  
    const videoStream = useMemo(() => {
        if (webcamOn && webcamStream) {
            const mediaStream = new MediaStream();
            mediaStream.addTrack(webcamStream.track);
            return mediaStream;
        }
    }, [webcamStream, webcamOn]);
  
    useEffect(() => {
        if (micRef.current) {
            if (micOn && micStream) {
                const mediaStream = new MediaStream();
                mediaStream.addTrack(micStream.track);

                micRef.current.srcObject = mediaStream;
                micRef.current
                    .play()
                    .catch((error) =>
                        console.error("videoElem.current.play() failed", error)
                    );
            } else {
                micRef.current.srcObject = null;
            }
        }
    }, [micStream, micOn]);

    const getCourse = courses.find((course) => course.id === Number(localStorage.getItem("course")));
    const memberFound = getCourse.members.find((member) => member.id === participantId);
    const isTeacher = memberFound.role === "Teacher";
    
    if (isTeacher) {
        return (
            <Box>
                {/* <p>
                  Participant: {displayName} | Webcam: {webcamOn ? "ON" : "OFF"} | Mic:{" "}
                  {micOn ? "ON" : "OFF"}
                </p> */}
                <audio ref={micRef} autoPlay playsInline muted={isLocal} />
                {webcamOn ? (
                  <ReactPlayer
                    //
                    playsinline // very very imp prop
                    pip={false}
                    light={false}
                    controls={false}
                    muted={true}
                    playing={true}
                    //
                    url={videoStream}
                    //
                    height={"calc(100vh - 72px - 48px - 24px)"}
                    width={"-webkit-fill-available"}
                    onError={(err) => {
                      console.log(err, "participant video error");
                    }}
                  />
                ) : (
                  <Box sx={{ display: "flex", justifyContent:"center", alignItems:"center", width: "100%"}}>
                     {/* <PersonIcon /> */}
                    </Box>
                )}
              </Box>
            );
    } else {
       return (
        <></>
       );
    }
    
}

export default ParticipantView;