import { Box, Button, Paper, Stack, TextField, Typography } from "@mui/material";
import { useSelector } from "react-redux";

function CommentCard () {
    const { meetings } = useSelector((state) => state.meeting);
    const { members } = useSelector((state) => state.course);
    const { profile } = useSelector((state) => state.account);

    const sampleComments = [
        {
            comment: "Hello Test",
            user: "Albrecht Lanojan"
        },
        {
            comment: "Hello Test",
            user: "Jaymark Carba"
        },
        {
            comment: "Hello Test",
            user: "Albrecht Lanojan"
        },
        {
            comment: "Hello Test",
            user: "Albrecht Lanojan"
        },
        {
            comment: "Hello Test",
            user: "Albrecht Lanojan"
        },
        {
            comment: "Hello Test",
            user: "Albrecht Lanojan"
        }
    ]
    console.log(profile?.full_name === sampleComments[0].user)
    return (
        <Paper sx={{ height: "100%", p: 1, position: "relative" }}>
            <Box 
                sx={{ 
                    maxHeight: "calc(100% - 25px - 8px)", 
                    px: 1,
                    overflow: "auto",
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
                }}
            >
                <Stack spacing={1}>
                    { sampleComments.map((comment, index) => (
                        <Paper key={index} sx={{ backgroundColor: "black", width: "fit-content", p: 1, marginLeft: profile?.full_name === comment.user ? "auto !important" : "" }}>
                                <Stack direction="row" spacing={1}>
                                    <img 
                                        src="/sample/default_avatar.png"
                                        alt="AccountProfile"
                                        style={{ width: "20px", height: "20px", marginRight: "5px", borderRadius: "5px" }}
                                    />
                                    <Stack spacing={0}>
                                        <Typography variant="body1" fontSize={14} color="grey">{comment.user}</Typography>
                                        <Typography variant="body1" fontSize={14}>{comment.comment}</Typography>
                                    </Stack>
                                </Stack>
                        </Paper>
                    )) }
                </Stack>
            </Box>
            <Paper sx={{ position: "absolute", bottom: 0, left: 0, width: "100%", p: 2}}>
                <Stack direction="row" spacing={1}>
                    <TextField fullWidth size="small" label="Write a comment..." />
                    <Button size="small" variant="contained">Send</Button>
                </Stack>
            </Paper>
        </Paper>
    );
}

export default CommentCard;