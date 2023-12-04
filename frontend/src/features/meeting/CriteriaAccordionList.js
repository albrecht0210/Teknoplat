import { ExpandMore } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionSummary, Box, Skeleton, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";

let CriteriaAccordion = ({ criteria }) => {
    return (
        <Accordion>
            <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls={`${criteria.name}-content`}
                id={`${criteria.name}-header`}
            >
                <Typography>{`${criteria.name} - ${criteria.weight * 100}%` }</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Typography sx={{ mb: 2 }}>{ criteria.description }</Typography>
            </AccordionDetails>
        </Accordion>
    );
}

let CriteriaAccordionSkeleton = ({ item }) => {
    return (
        <Accordion key={item}>
            <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls={`${item}-content`}
                id={`${item}-header`}
            >
                <Typography width={300}>
                    <Skeleton animation="wave" />
                </Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Typography>
                    <Skeleton animation="wave" />
                </Typography>
                <Typography>
                    <Skeleton animation="wave" />
                </Typography>
                <Typography>
                    <Skeleton animation="wave" />
                </Typography>
            </AccordionDetails>
        </Accordion>
    )
}

function CriteriaAccordionList() {
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
            <CriteriaAccordionSkeleton key={item} item={item} />
        ));
    } else {
        content = meeting.criteria.map((criteque) => (
            <CriteriaAccordion key={criteque.id} criteria={criteque} />
        ));
    }

    return (
        <Box p={3}>
            { content }
        </Box>
    );
}

export default CriteriaAccordionList;
