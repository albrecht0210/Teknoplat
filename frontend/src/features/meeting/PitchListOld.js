import { ExpandMore } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionSummary, Box, Skeleton, Stack, Typography } from "@mui/material";
import { useGetMembersForTeamQuery, useGetTeamsForPitchQuery } from "../api/apiSlice";
import { useSelector } from "react-redux";

let PitchAccordion = ({ pitch }) => {
    const { data: team } = useGetTeamsForPitchQuery({ id: pitch.id });
    const { data: members = [] } = useGetMembersForTeamQuery({ id: pitch.id });

    if (team === null || team === undefined || members.length === 0) {
        return <PitchLoading />
    } 
    return (
        <Accordion>
            <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls={`${pitch.name}-content`}
                id={`${pitch.name}-header`}
            >
                <Stack direction="row" spacing={1}>
                    {/* <Typography>{`${pitch.name}`}</Typography> */}
                    <Typography>{`${team.name} - ${pitch.name}`}</Typography>
                </Stack>
            </AccordionSummary>
            <AccordionDetails>
                <Typography sx={{ mb: 2 }}>{ pitch.description }</Typography>
                <Stack direction="row" spacing={1}>
                    <Typography>Team Members: </Typography>
                    { members.map((member, index) => (
                        <Typography key={member.id}>
                            {member.full_name}{index !== members.length - 1 && <span>,</span>}
                        </Typography>
                    )) }
                </Stack>
            </AccordionDetails>
        </Accordion>
    );
}

let PitchAccordionSkeleton = () => {
    return (
        <Accordion>
            <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls={`${item}-content`}
                id={`${item}-header`}
            >
                <Skeleton variant="text" />
            </AccordionSummary>
            <AccordionDetails>
                <Skeleton variant="text" />
                <Skeleton variant="text" />
                <Skeleton variant="text" />
            </AccordionDetails>
        </Accordion>
    );
}

function PitchList() {
    const { meeting } = useSelector((state) => state.meeting);

    let content;

    if (meeting === null) {
        content = [0, 1, 2, 3].map((item) => (
            <PitchLoading key={item} item={item} />
        ));
    } else {
        content = meeting.presentors.map((pitch) => (
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