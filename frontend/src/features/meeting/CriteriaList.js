import { ExpandMore } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionSummary, Box, Stack, Typography } from "@mui/material";
import { useSelector } from "react-redux";

let Criteria = ({ criteria }) => {
    return (
        <Accordion>
            <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls={`${criteria.criteria}-content`}
                id={`${criteria.criteria}-header`}
            >
                <Stack direction="row" spacing={1}>
                    <Typography>{`${criteria.criteria} - ${criteria.weight * 100}%` }</Typography>
                </Stack>
            </AccordionSummary>
            <AccordionDetails>
                <Typography sx={{ mb: 2 }}>{ criteria.description }</Typography>
            </AccordionDetails>
        </Accordion>
    )
}

let CriteriaLoading = ({ item }) => {
    return (
        <Accordion key={item}>
            <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls={`${item}-content`}
                id={`${item}-header`}
            >
                <Stack direction="row" spacing={1}>
                    <Typography className="loadingSlide"><span style={{ visibility: "hidden" }}>Loading</span></Typography>
                </Stack>
            </AccordionSummary>
            <AccordionDetails>
                <Typography className="loadingSlide"><span style={{ visibility: "hidden" }}>Loading</span></Typography>
            </AccordionDetails>
        </Accordion>
    );
}

function CriteriaList() {
    const { meeting } = useSelector((state) => state.meeting);

    let content;

    if (meeting === null) {
        content = [0, 1, 2, 3, 4].map((item) => (
            <CriteriaLoading key={item} item={item} />
        ));
    } else {
        content = meeting.criteria.map((critique) => (
            <Criteria key={critique.id} criteria={critique} />
        ));
    }

    return (
        <Box>
            { content }
        </Box>
    );
}

export default CriteriaList;