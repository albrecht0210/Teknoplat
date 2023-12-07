import { Box, Button, Paper, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useOutletContext } from "react-router-dom";
import { formatStringToUrl } from "../../utils/helper";
import Cookies from "js-cookie";
import axios from "axios";

const addComment = async (comment, account, team, allTeam = false) => {
    const access = Cookies.get("access");
    const meetingID = localStorage.getItem("meeting");

    const data = {
        account: account,
        comment: comment,
        team: team,
        all_team: allTeam,
    }

    const response = await axios.post(`http://localhost:8008/api/comments/?meeting=${meetingID}`, data, {
        headers: {
            Authorization: `Bearer ${access}`
        }
    });

    return response;
}

export async function commentLoader() {
    localStorage.setItem("meetingTabValue", 2);
    return { ok: true};
} 

function CommentCard () {
    const { profile, meeting } = useOutletContext();
    const scrollableBoxRef = useRef(null);

    const [socket, setSocket] = useState(null);
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState(meeting.comments);
    const [reScroll, setReScroll] = useState(false);

    useEffect(() => {
        const ws = new WebSocket(`ws://127.0.0.1:8008/ws/comments/${formatStringToUrl(meeting.name)}/`);

        ws.onopen = () => {
            console.log('WebSocket connected');
            setSocket(ws);
        };
        
        ws.onmessage = (event) => {
            const newComment = JSON.parse(event.data).comment;
            setComments((previous) => [
                ...previous,
                newComment
            ]);
            setComment("");
        };

        ws.onclose = () => {
            console.log('WebSocket disconnected');
            setSocket(null);
        };


        return () => {
            ws.close();
        };
    }, [meeting]);

    useEffect(() => {
        // Scroll to the bottom when the component mounts
        scrollableBoxRef.current.scrollTop = scrollableBoxRef.current.scrollHeight;
        if (reScroll) {
            setReScroll(false);
        }
      }, [reScroll]);

    const handleCommentChange = (e) => {
        const { value } = e.target;

        setComment(value);
    }

    const handleSubmit = async () => {
        if (socket) {
            try {
                const account = profile.id;
                const response = await addComment(comment, account, null);
                socket.send(JSON.stringify({
                    'comment': response.data
                }))
                setReScroll(true);
            } catch(error) {}
        } else {
            console.log("NULL");
        }
    }

    return (
        <Box pt={3} pl={3} pr={3}>
            <Paper sx={{ height: "calc(100vh - 64px - 48px - 124.5px - 24px - 48px - 24px - 1px)", p: 1, position: "relative" }}>
                <Box
                    ref={scrollableBoxRef}
                    sx={{ 
                        maxHeight: "calc(100vh - 64px - 48px - 124.5px - 24px - 48px - 24px - 72px - 16px - 1px)", 
                        px: 1,
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
                    }}
                >
                    <Stack spacing={2}>
                        { comments.map((comment) => (
                            <Paper key={comment.id} sx={{ backgroundColor: "black", width: "fit-content", p: 1, marginLeft: profile.full_name === comment.account_detail.full_name ? "auto !important" : "" }}>
                                <Stack direction="row" spacing={1}>
                                    <img 
                                        src="/sample/default_avatar.png"
                                        alt="AccountProfile"
                                        style={{ width: "20px", height: "20px", marginRight: "5px", borderRadius: "5px" }}
                                    />
                                    <Stack spacing={0}>
                                        <Typography variant="body1" fontSize={14} color="grey">{comment.account_detail.full_name}</Typography>
                                        <Typography variant="body1" fontSize={14}>{comment.comment}</Typography>
                                    </Stack>
                                </Stack>
                            </Paper>
                        )) }
                    </Stack>
                </Box>
                <Paper sx={{ position: "absolute", bottom: 0, left: 0, width: "100%", p: 2}}>
                    <Stack direction="row" spacing={1}>
                        <TextField value={comment} onChange={handleCommentChange} fullWidth size="small" label="Write a comment..." />
                        <Button onClick={handleSubmit} size="small" variant="contained">Send</Button>
                    </Stack>
                </Paper>
            </Paper>
        </Box>
    );
}

export default CommentCard;