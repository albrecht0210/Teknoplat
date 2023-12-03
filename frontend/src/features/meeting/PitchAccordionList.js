import { Accordion, AccordionDetails, AccordionSummary, Box, Skeleton, Stack, Typography } from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";
import { redirect, useLoaderData, useOutletContext } from "react-router-dom";
import { refreshAccessToken } from "../../services/services";
import { ExpandMore } from "@mui/icons-material";
import { useEffect, useState } from "react";

const fetchTeams = async () => {
    const access = Cookies.get("access");
    const courseId = localStorage.getItem("course");
    const response = await axios.get(`http://localhost:8080/api/teams/?course=${courseId}`, {
        headers: {
            Authorization: `Bearer ${access}`
        }
    });

    return response;
}

export async function pitchLoader({ request, params }) {
    try {
        const teamsResponse = await fetchTeams();
        
        return teamsResponse.data;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            try {
                await refreshAccessToken();
                const teamsResponse = await fetchTeams();
        
                return teamsResponse.data;
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

let PitchAccordion = ({ pitch, team }) => {
    return (
        <Accordion>
            <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls={`${pitch.name}-content`}
                id={`${pitch.name}-header`}
            >
                <Typography>{`${team.name} - ${pitch.name}`}</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Typography sx={{ mb: 2 }}>{ pitch.description }</Typography>
                <Stack direction="row" spacing={1}>
                    <Typography>Team Members: </Typography>
                    { team.members.map((member, index) => (
                        <Typography key={member.id}>
                            {member.full_name}{index !== team.members.length - 1 && <span>,</span>}
                        </Typography>
                    )) }
                </Stack>
            </AccordionDetails>
        </Accordion>
    );
}

let PitchAccordionSkeleton = ({ item }) => {
    return (
        <Accordion>
            <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls={`${item}-content`}
                id={`${item}-header`}
            >
                <Typography width={300}>
                    <Skeleton />
                </Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Typography>
                    <Skeleton />
                </Typography>
                <Typography>
                    <Skeleton />
                </Typography>
                <Typography>
                    <Skeleton />
                </Typography>
            </AccordionDetails>
        </Accordion>
    );
}

function PitchAccordionList() {
    const teams = useLoaderData();
    const { meeting } = useOutletContext();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    let content;

    if (loading) {
        content = [0, 1, 3].map((item) => (
            <PitchAccordionSkeleton key={item} item={item} />
        ));
    } else {
        content = meeting.presentors.map((presentor) => (
            <PitchAccordion key={presentor.id} pitch={presentor} team={teams.find((team) => team.id === presentor.team)} />
        ));
    }

    return (
        <Box p={3}>
            { content }
        </Box>
    );
}

export default PitchAccordionList;
