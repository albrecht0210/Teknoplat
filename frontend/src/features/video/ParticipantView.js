import { Box, Typography } from "@mui/material";
import { useParticipant } from "@videosdk.live/react-sdk";
import { useEffect, useMemo, useRef } from "react";
import ReactPlayer from "react-player";
import { useOutletContext } from "react-router-dom";

function ParticipantView(props) {
    const { participantId } = props;
    const micRef = useRef(null);
    const { courses } = useOutletContext();
    console.log(courses);

    const { webcamStream, micStream, webcamOn, micOn, isLocal, displayName } = useParticipant(participantId);
    console.log("Partcipant", participantId, " IsWebcamOn? ", webcamOn)
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
    
    return (
        <Box>
            {/* <p>
              Participant: {displayName} | Webcam: {webcamOn ? "ON" : "OFF"} | Mic:{" "}
              {micOn ? "ON" : "OFF"}
            </p> */}
            <audio ref={micRef} autoPlay playsInline muted={isLocal} />
            {webcamOn ? (
              <Box sx={{ position: "relative", backgroundRepeat: "no-repeat", backgroundSize: "cover", backgroundPosition: "center center" }}>
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
                <Box sx={{ position: "absolute", top: 0, bottom: 0, right: 0, left: 0, width: "100%", height: "100%", backgroundAttachment: "fixed" }}>
                  <Box sx={{ backgroundColor: "#000000a8", position: "absolute", bottom: 0, p: 1 }}>
                    <Typography variant="button" fontSize={12}>{displayName}</Typography>
                  </Box>
                </Box>
              </Box>
            ) : (
              <Box sx={{ display: "flex", justifyContent:"center", alignItems:"center", width: "100%"}}>
                  {/* <PersonIcon /> */}
                </Box>
            )}
          </Box>
        );
}

export default ParticipantView;