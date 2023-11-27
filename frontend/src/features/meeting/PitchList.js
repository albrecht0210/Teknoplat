import { ExpandMore } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionSummary, Box, Stack, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { useGetPitchTeamMembersQuery, useGetPitchTeamQuery } from "../api/apiSlice";

let Pitch = ({ pitch }) => {
    const { data: team, isSuccess: teamFetchSuccess } = useGetPitchTeamQuery({ id: pitch.id })
    const { data: members = [], isSuccess: membersFetchSuccess } = useGetPitchTeamMembersQuery({ id: pitch.id });
    
    let teamName;
    let membersName;

    if (team !== null && teamFetchSuccess) {
        teamName = <Typography>{team?.name}:</Typography>
    } 

    if (members.length !== 0 && membersFetchSuccess) {
        membersName = (
            <Stack direction="row" spacing={1}>
                <Typography>Team Members: </Typography>
                { members.map((member) => (
                    <Typography key={member.id}>{member.full_name}, </Typography>
                )) }
            </Stack>
        )
    }

    return (
        <Accordion>
            <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls={`${pitch.name}-content`}
                id={`${pitch.name}-header`}
            >
                <Stack direction="row" spacing={1}>
                    { teamName }
                    <Typography>{ pitch.name }</Typography>
                </Stack>
            </AccordionSummary>
            <AccordionDetails>
                <Typography sx={{ mb: 2 }}>{ pitch.description }</Typography>
                { membersName }
            </AccordionDetails>
        </Accordion>
    )
}

function PitchList() {
    const { pitches } = useSelector((state) => state.pitch);

    let content;

    if (pitches.length === 0) {
        content = null;
    } else {
        content = pitches.map((pitch) => (
            <Pitch key={pitch.id} pitch={pitch} />
        ));
    }

    return (
        <Box>
            { content }
        </Box>
    );
}

export default PitchList;