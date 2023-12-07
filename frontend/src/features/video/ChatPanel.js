import { Box, Button, Paper, Stack, TextField, Typography } from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { formatStringToUrl } from "../../utils/helper";

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

function ChatPanel(props) {
    const { meeting } = props;
    const { profile } = useOutletContext();

    const scrollableBoxRef = useRef(null);

    const [socket, setSocket] = useState(null);
    const [chat, setChat] = useState("");
    const [chats, setChats] = useState(localStorage.getItem("meeting_chats") ? JSON.parse(localStorage.getItem("meeting_chats")) : meeting.comments);
    const [reScroll, setReScroll] = useState(false);

    useEffect(() => {
        const ws = new WebSocket(`ws://127.0.0.1:8008/ws/comments/${formatStringToUrl(meeting.name)}/`);

        ws.onopen = () => {
            console.log('WebSocket connected');
            setSocket(ws);
        };
        
        ws.onmessage = (event) => {
            const newChat = JSON.parse(event.data).comment;
            const newChats = [...chats, newChat]
            setChats(newChats);
            setChat("");
            setReScroll(true);
            localStorage.setItem("meeting_chats", JSON.stringify(newChats));
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

    const handleChatChange = (e) => {
        const { value } = e.target;

        setChat(value);
    }

    const handleSubmit = async () => {
        if (socket) {
            try {
                const account = profile.id;
                const response = await addComment(chat, account, null);
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
        <Paper sx={{ height: "calc(100vh - 72px - 48px - 24px)", width: "calc(100vw * 0.25)" }}>
            <Box 
                ref={scrollableBoxRef}
                sx={{ 
                    height: "calc(100vh - 72px - 72px - 48px - 24px)", 
                    maxHeight: "calc(100vh - 72px - 72px - 48px - 24px)", 
                    width: "calc(100vw * 0.25)",
                    px: 1,
                    py: 2,
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
                    { chats.map((chat) => (
                        <Paper key={chat.id} sx={{ backgroundColor: "black", width: "fit-content", maxWidth: "80%", p: 1, marginLeft: profile.full_name === chat.account_detail.full_name ? "auto !important" : "" }}>
                            <Stack direction="row" spacing={1}>
                                <img 
                                    src="/sample/default_avatar.png"
                                    alt="AccountProfile"
                                    style={{ width: "20px", height: "20px", marginRight: "5px", borderRadius: "5px" }}
                                />
                                <Stack spacing={0}>
                                    <Typography variant="body1" fontSize={14} color="grey">{chat.account_detail.full_name}</Typography>
                                    <Typography variant="body1" fontSize={14}>{chat.comment}</Typography>
                                </Stack>
                            </Stack>
                        </Paper>
                    )) }
                </Stack>
            </Box>
            <Box sx={{ width: "100%", p: 2 }}>
                <Stack direction="row" spacing={1}>
                    <TextField onChange={handleChatChange} value={chat} fullWidth size="small" label="Write..." />
                    <Button onClick={handleSubmit} size="small" variant="contained">Send</Button>
                </Stack>
            </Box>
        </Paper>
    );
}

export default ChatPanel;
