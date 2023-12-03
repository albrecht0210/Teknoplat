import { Box, Button, Paper, Stack, TextField, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { useOutletContext } from "react-router-dom";

function CommentCard () {
    const { profile, meeting } = useOutletContext();

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
    return (
        <Box pt={3} pl={3} pr={3}>
            <Paper sx={{ height: "calc(100vh - 64px - 48px - 124.5px - 24px - 48px - 24px - 1px)", p: 1, position: "relative" }}>
                <Box 
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
                    <Stack spacing={1}>
                        { sampleComments.map((comment, index) => (
                            <Paper key={index} sx={{ backgroundColor: "black", width: "fit-content", p: 1, marginLeft: profile.full_name === comment.user ? "auto !important" : "" }}>
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
        </Box>
    );
}

export default CommentCard;